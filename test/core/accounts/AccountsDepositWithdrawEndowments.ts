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
  IndexFund,
  IndexFund__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";
import {deployFacetAsProxy} from "./utils/deployTestFacet";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsDepositWithdrawEndowments";
import {BigNumber} from "ethers";

use(smock.matchers);

describe("AccountsDepositWithdrawEndowments", function () {
  const {ethers} = hre;

  const endowId = 1;
  const depositReq: AccountMessages.DepositRequestStruct = {
    id: endowId,
    liquidPercentage: 40,
    lockedPercentage: 60,
  };

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;
  let endowment: AccountStorage.EndowmentStruct;
  let indexFundFake: FakeContract<IndexFund>;
  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());

    indexFundFake = await smock.fake<IndexFund>(new IndexFund__factory());
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
      indexFundContract: indexFundFake.address,
    };
    registrarFake.queryConfig.returns(config);
  });

  describe("upon depositMatic", async function () {
    it("reverts if the deposit value is 0 (zero)", async () => {
      await expect(facet.depositMatic(depositReq, {value: 0})).to.be.revertedWith("Invalid Amount");
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(endowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.depositMatic(depositReq, {value: 10000})).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      const invalidReq: AccountMessages.DepositRequestStruct = {
        id: endowId,
        liquidPercentage: 10,
        lockedPercentage: 10,
      };
      await expect(facet.depositMatic(invalidReq, {value: 10000})).to.be.revertedWith(
        "InvalidSplit"
      );
    });

    it("reverts if the deposit fee transfer fails", async () => {
      await state.setEndowmentDetails(endowId, {
        ...endowment,
        depositFee: {payoutAddress: genWallet().address, bps: 5},
      });

      wmaticFake.transfer.returns(false);

      await expect(facet.depositMatic(depositReq, {value: 10000})).to.be.revertedWith(
        "Transfer Failed"
      );
    });

    it("reverts if no index fund contract is registered in the Registrar", async () => {
      // no index fund address registered
      const config: typeof DEFAULT_REGISTRAR_CONFIG = {
        ...DEFAULT_REGISTRAR_CONFIG,
        wMaticAddress: wmaticFake.address,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.depositMatic(depositReq, {value: 10000})).to.be.revertedWith(
        "No Index Fund"
      );
    });

    it("deposits MATIC with no locked amount", async () => {
      endowOwner.sendTransaction({
        value: ethers.utils.parseEther("1.0"),
        to: indexFundFake.address,
      });

      await expect(
        facet
          .connect(await ethers.getSigner(indexFundFake.address))
          .depositMatic({id: endowId, lockedPercentage: 0, liquidPercentage: 100}, {value: 10000})
      )
        .to.emit(facet, "EndowmentDeposit")
        .withArgs(depositReq.id, wmaticFake.address, 0, 10000);

      const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
        depositReq.id,
        wmaticFake.address
      );
      expect(lockedBal).to.equal(BigNumber.from(0));
      expect(liquidBal).to.equal(BigNumber.from(10000));
    });
  });
});
