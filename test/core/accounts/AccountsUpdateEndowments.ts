import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG} from "test/utils";
import {
  AccountsUpdateEndowments,
  AccountsUpdateEndowments__factory,
  IIndexFund,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {
  AccountStorage,
  LibAccounts,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsUpdateEndowments", function () {
  const {ethers} = hre;

  const accountId = 1;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsUpdateEndowments;
  let state: TestFacetProxyContract;
  let endowment: AccountStorage.EndowmentStruct;
  let treasuryAddress: string;

  let registrarFake: FakeContract<Registrar>;

  const beneficiary: LibAccounts.BeneficiaryStruct = {
    enumData: 0,
    data: {addr: genWallet().address, endowId: 0, fundId: 0},
  };

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    treasuryAddress = signers.apTeam2.address;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateEndowments__factory(accOwner);
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

    facet = AccountsUpdateEndowments__factory.connect(state.address, endowOwner);
  });

  it("reverts if the endowment is already closed", async () => {
    await state.setClosingEndowmentState(accountId, true, beneficiary);
    await expect(facet.updateEndowmentDetails(accountId, beneficiary)).to.be.revertedWith(
      "Endowment is closed"
    );
  });

  it("reverts if there is a redemption in progress for the endowment", async () => {
    await state.setEndowmentDetails(accountId, {...endowment, pendingRedemptions: 1});
    await expect(facet.updateEndowmentDetails(accountId, beneficiary)).to.be.revertedWith(
      "RedemptionInProgress"
    );
  });

  it("reverts if the beneficiary is set to 'None' and no index fund is configured in the registrar", async () => {
    registrarFake.queryConfig.returns(DEFAULT_REGISTRAR_CONFIG);

    const beneficiaryNone: LibAccounts.BeneficiaryStruct = {...beneficiary, enumData: 3};

    await expect(facet.updateEndowmentDetails(accountId, beneficiaryNone)).to.be.revertedWith(
      "Beneficiary is NONE & Index Fund Contract is not configured in Registrar"
    );
  });

  it("reverts if the endowment has active strategies", async () => {
    await state.setActiveStrategyEndowmentState(accountId, strategies[0], true);
    await expect(facet.updateEndowmentDetails(accountId, beneficiary)).to.be.revertedWith(
      "Not fully exited"
    );
  });

  it("removes the closing endowment from all index funds it is involved in", async () => {
    await expect(facet.updateEndowmentDetails(accountId, beneficiary))
      .to.emit(facet, "EndowmentUpdated")
      .withArgs(accountId);

    const endowState = await state.getClosingEndowmentState(accountId);

    expect(endowState[0]).to.equal(true);
    expect(endowState[1].enumData).to.equal(beneficiary.enumData);
    expect(endowState[1].data.addr).to.equal(beneficiary.data.addr);
    expect(endowState[1].data.endowId).to.equal(beneficiary.data.endowId);
    expect(endowState[1].data.fundId).to.equal(beneficiary.data.fundId);
  });

  it("updates the beneficiary to the treasury address if the beneficiary is set to 'None' and the endowment is not involved in any funds", async () => {
    indexFundFake.queryInvolvedFunds.returns([]);
    const beneficiaryNone: LibAccounts.BeneficiaryStruct = {...beneficiary, enumData: 3};

    await expect(facet.updateEndowmentDetails(accountId, beneficiaryNone))
      .to.emit(facet, "EndowmentUpdated")
      .withArgs(accountId);

    const endowState = await state.getClosingEndowmentState(accountId);

    expect(endowState[0]).to.equal(true);
    expect(endowState[1].enumData).to.equal(2);
    expect(endowState[1].data.addr).to.equal(treasuryAddress);
    expect(endowState[1].data.endowId).to.equal(0);
    expect(endowState[1].data.fundId).to.equal(0);
  });

  it("updates the beneficiary to the first index fund if the beneficiary is set to 'None' and the endowment is involved in one or more funds", async () => {
    const funds: IIndexFund.IndexFundStruct[] = [
      {
        description: "d1",
        expiryTime: BigNumber.from(100),
        id: BigNumber.from(1),
        name: "if1",
        members: [accountId],
        splitToLiquid: 50,
      },
      {
        description: "d2",
        expiryTime: BigNumber.from(100),
        id: BigNumber.from(2),
        name: "if2",
        members: [accountId],
        splitToLiquid: 50,
      },
    ];
    indexFundFake.queryInvolvedFunds.returns(funds);
    const beneficiaryNone: LibAccounts.BeneficiaryStruct = {...beneficiary, enumData: 3};

    await expect(facet.updateEndowmentDetails(accountId, beneficiaryNone))
      .to.emit(facet, "EndowmentUpdated")
      .withArgs(accountId);

    const endowState = await state.getClosingEndowmentState(accountId);

    expect(endowState[0]).to.equal(true);
    expect(endowState[1].enumData).to.equal(1);
    expect(endowState[1].data.addr).to.equal(ethers.constants.AddressZero);
    expect(endowState[1].data.endowId).to.equal(0);
    expect(endowState[1].data.fundId).to.equal(funds[0].id);
  });
});
