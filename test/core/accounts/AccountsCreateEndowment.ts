import {expect} from "chai";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  TestFacetProxyContract,
  AccountsCreateEndowment__factory,
  AccountsCreateEndowment,
  Registrar__factory,
} from "typechain-types";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsCreateEndowment";
import {logger} from "utils";
import {BigNumber} from "ethers";

describe("AccountsCreateEndowment", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let charityApplications: SignerWithAddress;
  let axelarGateway: SignerWithAddress;
  let deployer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let donationMatchCharitesContract: SignerWithAddress;
  let facet: AccountsCreateEndowment;
  let proxy: TestFacetProxyContract;
  let createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct;

  before(async function () {
    logger.off();

    [
      owner,
      proxyAdmin,
      charityApplications,
      axelarGateway,
      deployer,
      treasury,
      donationMatchCharitesContract,
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
  });

  beforeEach(async function () {
    const registrarDeployment = await deployRegistrar(
      {
        axelarGateway: axelarGateway.address,
        axelarGasService: proxyAdmin.address,
        router: ethers.constants.AddressZero,
        owner: owner.address,
        deployer,
        proxyAdmin,
        treasuryAddress: treasury.address,
      },
      hre
    );
    const endowDeployments = await deployEndowmentMultiSig(hre);
    const Registrar = Registrar__factory.connect(registrarDeployment!.address, owner);
    const {splitToLiquid, ...curConfig} = await Registrar.queryConfig();
    await Registrar.updateConfig({
      ...curConfig,
      splitDefault: splitToLiquid.defaultSplit,
      splitMax: splitToLiquid.max,
      splitMin: splitToLiquid.min,
      charityApplications: charityApplications.address,
      multisigFactory: endowDeployments!.factory.address,
      multisigEmitter: endowDeployments!.emitter.address,
      donationMatchCharitesContract: donationMatchCharitesContract.address,
    });

    let Facet = new AccountsCreateEndowment__factory(owner);
    let facetImpl = await Facet.deploy();
    proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await proxy.setConfig({
      owner: owner.address,
      version: "1",
      registrarContract: Registrar.address,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsCreateEndowment__factory.connect(proxy.address, owner);
  });

  after(() => {
    logger.on();
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

    const newEndowment = await proxy.getEndowmentDetails(endowmentId);

    // `ignoreUserSplits` is set to `false` by default
    expect(newEndowment.ignoreUserSplits).to.be.false;
    // `donationMatchContract` is read from `registrar config > donationMatchCharitesContract`
    expect(newEndowment.donationMatchContract).to.equal(donationMatchCharitesContract.address);
  });
});
