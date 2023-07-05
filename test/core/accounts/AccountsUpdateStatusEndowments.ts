import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {
  AccountsUpdateStatusEndowments,
  AccountsUpdateStatusEndowments__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateStatusEndowments";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsUpdateStatusEndowments", function () {
  const {ethers} = hre;

  const accountId = 1;
  const beneficiary: LibAccounts.BeneficiaryStruct = {
    enumData: 0,
    data: {addr: genWallet().address, endowId: accountId, fundId: 1},
  };

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsUpdateStatusEndowments;
  let state: TestFacetProxyContract;
  let registrarFake: FakeContract<Registrar>;
  let endowment: AccountStorage.EndowmentStruct;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateStatusEndowments__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    await state.setEndowmentDetails(accountId, endowment);
    await state.setConfig({
      owner: accOwner.address,
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

    facet = AccountsUpdateStatusEndowments__factory.connect(state.address, endowOwner);
  });

  it("reverts if the caller is not the owner of the endowment", async () => {
    await expect(facet.connect(accOwner).closeEndowment(accountId, beneficiary)).to.be.revertedWith(
      "Unauthorized"
    );
  });

  it("reverts if the endowment is already closed", async () => {
    await state.setClosingEndowmentState(accountId, true, beneficiary);
    await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
      "Endowment is closed"
    );
  });

  it("reverts if there is a redemption in progress for the endowment", async () => {
    await state.setEndowmentDetails(accountId, {...endowment, pendingRedemptions: 1});
    await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
      "RedemptionInProgress"
    );
  });

  it("reverts if the beneficiary is set to 'None' and no index fund is configured in the registrar", async () => {
    const beneficiaryNone = {...beneficiary, enumData: 3};
    await expect(facet.closeEndowment(accountId, beneficiaryNone)).to.be.revertedWith(
      "Beneficiary is NONE & Index Fund Contract is not configured in Registrar"
    );
  });

  // it("closes an endowment and update the endowment state with the provided beneficiary", async () => {
  //   // test case
  // });

  // it("updates the beneficiary to the treasury address if the beneficiary is set to 'None' and the endowment is not involved in any funds", async () => {
  //   // test case
  // });

  // it("updates the beneficiary to the first index fund if the beneficiary is set to 'None' and the endowment is involved in one or more funds", async () => {
  //   // test case
  // });

  // it("removes the closing endowment from all index funds it is involved in", async () => {
  //   // test case
  // });

  // const strategies: string[] = ["strat1", "strat2", "strat3"].map((x) => ethers.utils.id(x));
  //   registrarFake.queryAllStrategies.returns(strategies);
});
