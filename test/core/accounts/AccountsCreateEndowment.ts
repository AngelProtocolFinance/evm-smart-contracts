import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {
  AccountsCreateEndowment,
  AccountsCreateEndowment__factory,
  EndowmentMultiSigFactory,
  EndowmentMultiSigFactory__factory,
  GasFwdFactory,
  GasFwdFactory__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsCreateEndowment";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsCreateEndowment", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let charityApplications: SignerWithAddress;
  let donationMatchCharitesContract: SignerWithAddress;
  let facet: AccountsCreateEndowment;
  let state: TestFacetProxyContract;
  let createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct;
  let endowmentOwner: string;
  let registrarFake: FakeContract<Registrar>;
  let gasFwdFactoryFake: FakeContract<GasFwdFactory>;

  before(async function () {
    let signers: SignerWithAddress[];
    [
      owner,
      proxyAdmin,
      charityApplications,
      donationMatchCharitesContract,
      {address: endowmentOwner},
      ...signers
    ] = await ethers.getSigners();

    const defaultSettingsPermissionsStruct = {
      locked: false,
      delegate: {
        addr: owner.address,
        expires: 0,
      },
    };

    const defaultFeeStruct = {
      payoutAddress: owner.address,
      bps: 1000,
    };

    createEndowmentRequest = {
      duration: 3600, // 1h
      withdrawBeforeMaturity: false,
      maturityTime: 0,
      name: `Test Endowment #1`,
      sdgs: [1],
      referralId: 0,
      tier: 0,
      endowType: 1, // Endowment
      logo: "",
      image: "",
      members: [owner.address],
      threshold: 1,
      allowlistedBeneficiaries: [],
      allowlistedContributors: [],
      earlyLockedWithdrawFee: defaultFeeStruct,
      withdrawFee: defaultFeeStruct,
      depositFee: defaultFeeStruct,
      balanceFee: defaultFeeStruct,
      proposalLink: 0,
      settingsController: {
        acceptedTokens: defaultSettingsPermissionsStruct,
        lockedInvestmentManagement: defaultSettingsPermissionsStruct,
        liquidInvestmentManagement: defaultSettingsPermissionsStruct,
        allowlistedBeneficiaries: defaultSettingsPermissionsStruct,
        allowlistedContributors: defaultSettingsPermissionsStruct,
        maturityAllowlist: defaultSettingsPermissionsStruct,
        maturityTime: defaultSettingsPermissionsStruct,
        earlyLockedWithdrawFee: defaultSettingsPermissionsStruct,
        withdrawFee: defaultSettingsPermissionsStruct,
        depositFee: defaultSettingsPermissionsStruct,
        balanceFee: defaultSettingsPermissionsStruct,
        name: defaultSettingsPermissionsStruct,
        image: defaultSettingsPermissionsStruct,
        logo: defaultSettingsPermissionsStruct,
        sdgs: defaultSettingsPermissionsStruct,
        splitToLiquid: defaultSettingsPermissionsStruct,
        ignoreUserSplits: defaultSettingsPermissionsStruct,
      },
      parent: 0,
      maturityAllowlist: [],
      ignoreUserSplits: false,
      splitToLiquid: {
        max: 100,
        min: 0,
        defaultSplit: 50,
      },
    };

    const endowmentFactoryFake = await smock.fake<EndowmentMultiSigFactory>(
      new EndowmentMultiSigFactory__factory(),
      {
        address: signers[0].address,
      }
    );
    endowmentFactoryFake.create.returns(endowmentOwner);

    gasFwdFactoryFake = await smock.fake<GasFwdFactory>(new GasFwdFactory__factory())
    gasFwdFactoryFake.create.returns(ethers.constants.AddressZero)

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: signers[1].address,
    });
    const rebParams: Partial<LocalRegistrarLib.RebalanceParamsStructOutput> = {
      basis: 100,
      rebalanceLiquidProfits: false,
      lockedRebalanceToLiquid: 75,
      interestDistribution: 20,
      lockedPrincipleToLiquid: false,
      principleDistribution: 0,
    };
    registrarFake.getRebalanceParams.returns(rebParams);
    const config: Partial<RegistrarStorage.ConfigStructOutput> = {
      indexFundContract: ethers.constants.AddressZero,
      accountsContract: ethers.constants.AddressZero,
      treasury: ethers.constants.AddressZero,
      subdaoGovContract: ethers.constants.AddressZero, // Sub dao implementation
      subdaoTokenContract: ethers.constants.AddressZero, // NewERC20 implementation
      subdaoBondingTokenContract: ethers.constants.AddressZero, // Continous Token implementation
      subdaoCw900Contract: ethers.constants.AddressZero,
      subdaoDistributorContract: ethers.constants.AddressZero,
      subdaoEmitter: ethers.constants.AddressZero,
      donationMatchContract: ethers.constants.AddressZero,
      splitToLiquid: {max: 0, min: 0, defaultSplit: 0} as any,
      haloToken: ethers.constants.AddressZero,
      haloTokenLpContract: ethers.constants.AddressZero,
      govContract: ethers.constants.AddressZero,
      donationMatchEmitter: ethers.constants.AddressZero,
      collectorShare: BigNumber.from(50),
      charitySharesContract: ethers.constants.AddressZero,
      fundraisingContract: ethers.constants.AddressZero,
      uniswapRouter: ethers.constants.AddressZero,
      uniswapFactory: ethers.constants.AddressZero,
      lockedWithdrawal: ethers.constants.AddressZero,
      proxyAdmin: ethers.constants.AddressZero,
      usdcAddress: ethers.constants.AddressZero,
      wMaticAddress: ethers.constants.AddressZero,
      cw900lvAddress: ethers.constants.AddressZero,
      charityApplications: charityApplications.address,
      multisigFactory: endowmentFactoryFake.address,
      multisigEmitter: ethers.constants.AddressZero,
      donationMatchCharitesContract: donationMatchCharitesContract.address,
      gasFwdFactoryAddress: gasFwdFactoryFake.address
    };
    registrarFake.queryConfig.returns(config);
  });

  beforeEach(async function () {
    let Facet = new AccountsCreateEndowment__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: owner.address,
      version: "1",
      registrarContract: registrarFake.address,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsCreateEndowment__factory.connect(state.address, owner);
  });

  it("should revert if the caller is not authorized to create a charity endowment", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      endowType: 0, // Charity
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith("Unauthorized");
  });

  it("should revert if the earlyLockedWithdrawFee payout address is a zero address for a non-charity endowment", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      earlyLockedWithdrawFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee payout zero address given"
    );
  });

  it("should revert if the earlyLockedWithdrawFee basis points is greater than 10000", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      earlyLockedWithdrawFee: {
        bps: 100000,
        payoutAddress: owner.address,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee basis points given. Should be between 0 and 10000."
    );
  });

  it("should revert if the withdrawFee payout address is a zero address for a non-charity endowment", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      withdrawFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee payout zero address given"
    );
  });

  it("should revert if the withdrawFee basis points is greater than 10000", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      withdrawFee: {
        bps: 100000,
        payoutAddress: owner.address,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee basis points given. Should be between 0 and 10000."
    );
  });

  it("should revert if the depositFee payout address is a zero address for a non-charity endowment", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      depositFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee payout zero address given"
    );
  });

  it("should revert if the depositFee basis points is greater than 10000", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      depositFee: {
        bps: 100000,
        payoutAddress: owner.address,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee basis points given. Should be between 0 and 10000."
    );
  });

  it("should revert if the balanceFee payout address is a zero address for a non-charity endowment", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      balanceFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee payout zero address given"
    );
  });

  it("should revert if the balanceFee basis points is greater than 10000", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      balanceFee: {
        bps: 100000,
        payoutAddress: owner.address,
      },
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Invalid fee basis points given. Should be between 0 and 10000."
    );
  });

  it("should revert if no members provided for Endowment multisig", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      members: [],
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "No members provided for Endowment multisig"
    );
  });

  it("should revert if threshold is not a positive number", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      threshold: 0,
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Threshold must be a positive number"
    );
  });

  it("should revert if threshold is greater than member count", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      threshold: 2,
    };

    await expect(facet.createEndowment(details)).to.be.revertedWith(
      "Threshold greater than member count"
    );
  });

  it("should create a normal endowment if the caller is authorized and input parameters are valid", async () => {
    await expect(facet.createEndowment(createEndowmentRequest)).to.emit(facet, "EndowmentCreated");
  });

  it("should create a charity endowment if the caller is authorized and input parameters are valid", async () => {
    const details: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      endowType: 0, // Charity
      ignoreUserSplits: true,
      // `earlyLockedWithdrawFee` is not validated
      earlyLockedWithdrawFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    const tx = await facet.connect(charityApplications).createEndowment(details);
    const createEndowmentReceipt = await tx.wait();

    // Get the endowment ID from the event emitted in the transaction receipt
    const event = createEndowmentReceipt.events?.find((e) => e.event === "EndowmentCreated");
    const endowmentId = BigNumber.from(event!.args!.endowId);

    // verify endowment was created by checking the emitted event's parameter
    expect(endowmentId).to.exist;

    const newEndowment = await state.getEndowmentDetails(endowmentId);

    // `ignoreUserSplits` is set to `false` by default
    expect(newEndowment.ignoreUserSplits).to.be.false;
    // `donationMatchContract` is read from `registrar config > donationMatchCharitesContract`
    expect(newEndowment.donationMatchContract).to.equal(donationMatchCharitesContract.address);
    expect(newEndowment.owner).to.equal(endowmentOwner);
    expect(newEndowment.multisig).to.equal(newEndowment.owner);
  });
});
