import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG} from "test/utils";
import {
  AccountsDepositWithdrawEndowments,
  AccountsDepositWithdrawEndowments__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";
import {deployFacetAsProxy} from "./utils/deployTestFacet";
import {deployDummyWMATIC} from "test/utils/dummyWMATIC";

use(smock.matchers);

describe("AccountsDepositWithdrawEndowments", function () {
  const {ethers} = hre;

  const endowId = 1;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;
  let endowment: AccountStorage.EndowmentStruct;
  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());
  });

  beforeEach(async () => {
    let Facet = new AccountsDepositWithdrawEndowments__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    await state.setEndowmentDetails(endowId, endowment);

    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: endowId + 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsDepositWithdrawEndowments__factory.connect(state.address, endowOwner);

    wmaticFake = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());

    const config: typeof DEFAULT_REGISTRAR_CONFIG = {
      ...DEFAULT_REGISTRAR_CONFIG,
      wMaticAddress: wmaticFake.address,
    };
    registrarFake.queryConfig.returns(config);
  });

  describe("upon depositMatic", async function () {
    it("reverts if the deposit value is 0 (zero)", async () => {
      await expect(
        facet.depositMatic(
          {
            id: endowId,
            liquidPercentage: 10,
            lockedPercentage: 10,
          },
          {value: 0}
        )
      ).to.be.revertedWith("Invalid Amount");
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(endowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.depositMatic(
          {
            id: endowId,
            liquidPercentage: 10,
            lockedPercentage: 10,
          },
          {value: 1}
        )
      ).to.be.revertedWith("Endowment is closed");
    });

    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      await expect(
        facet.depositMatic(
          {
            id: endowId,
            liquidPercentage: 10,
            lockedPercentage: 10,
          },
          {value: 1}
        )
      ).to.be.revertedWith("InvalidSplit");
    });

    // it("reverts if the deposit fee transfer fails", async () => {
    //   await expect(
    //     facet.depositMatic(
    //       {
    //         id: endowId,
    //         liquidPercentage: 10,
    //         lockedPercentage: 10,
    //       },
    //       {value: 1}
    //     )
    //   ).to.be.revertedWith("InvalidSplit");
    // });
  });
});
