import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {
  AccountsUpdateStatusEndowments,
  AccountsUpdateStatusEndowments__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import "../../utils/setup";
import {genWallet, getSigners} from "utils";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateStatusEndowments";
import {DEFAULT_CHARITY_ENDOWMENT} from "test/utils";

use(smock.matchers);

describe("AccountsUpdateStatusEndowments", function () {
  const {ethers} = hre;

  const beneficiaryValid: LibAccounts.BeneficiaryStruct = {
    enumData: 3,
    data: {addr: genWallet().address, endowId: 1, fundId: 1},
  };
  const beneficiaryDefault: LibAccounts.BeneficiaryStruct = {
    enumData: 0,
    data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
  };
  const accountId = 1;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let facet: AccountsUpdateStatusEndowments;
  let state: TestFacetProxyContract;
  let registrarFake: FakeContract<Registrar>;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateStatusEndowments__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    await state.setEndowmentDetails(accountId, DEFAULT_CHARITY_ENDOWMENT);
    await state.setConfig({
      owner: owner.address,
      version: "1",
      registrarContract: registrarFake.address,
      nextAccountId: accountId + 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsUpdateStatusEndowments__factory.connect(state.address, owner);
  });

  it("should revert if the caller is not authorized to create a charity endowment", async () => {
    await expect(
      facet.closeEndowment(beneficiaryValid.data.endowId, beneficiaryValid)
    ).to.be.revertedWith("Unauthorized");
  });

  // const strategies: string[] = ["strat1", "strat2", "strat3"].map((x) => ethers.utils.id(x));
  //   registrarFake.queryAllStrategies.returns(strategies);
});
