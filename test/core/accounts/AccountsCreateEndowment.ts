import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {
  AccountsCreateEndowment,
  AccountsCreateEndowment__factory,
  EndowmentMultiSigFactory,
  EndowmentMultiSigFactory__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsCreateEndowment";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsCreateEndowment", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let charityApplications: SignerWithAddress;
  let axelarGateway: SignerWithAddress;
  let axelarGasService: SignerWithAddress;
  let deployer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let donationMatchCharitesContract: SignerWithAddress;
  let facet: AccountsCreateEndowment;
  let state: TestFacetProxyContract;
  let Registrar: Registrar;
  let createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct;
  let endowmentOwner: string;
  let registrarFake: FakeContract<Registrar>;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    charityApplications = signers.deployer;
    axelarGateway = signers.apTeam2;
    axelarGasService = signers.apTeam3;
    deployer = signers.deployer;
    treasury = signers.deployer;
    donationMatchCharitesContract = signers.deployer;
    endowmentOwner = genWallet().address;

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
        address: genWallet().address,
      }
    );
    endowmentFactoryFake.create.returns(endowmentOwner);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
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
    };
    registrarFake.queryConfig.returns(config);
  });

  beforeEach(async function () {
    const registrarDeployment = await deployRegistrar(
      {
        axelarGateway: axelarGateway.address,
        axelarGasService: axelarGasService.address,
        router: ethers.constants.AddressZero,
        owner: owner.address,
        deployer,
        proxyAdmin,
        treasuryAddress: treasury.address,
      },
      hre
    );
    const endowDeployments = await deployEndowmentMultiSig(hre);
    Registrar = Registrar__factory.connect(registrarDeployment!.address, owner);
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
    const request = {...createEndowmentRequest};

    const tx = await facet.connect(charityApplications).createEndowment(request);
    const createEndowmentReceipt = await tx.wait();

    // Get the endowment ID from the event emitted in the transaction receipt
    const event = createEndowmentReceipt.events?.find((e) => e.event === "EndowmentCreated");
    let endowmentId = event?.args?.endowId ? BigNumber.from(event.args.endowId) : undefined;

    // verify endowment was created by checking the emitted event's parameter
    expect(endowmentId).to.exist;
    endowmentId = endowmentId!;

    const result = await state.getEndowmentDetails(endowmentId);

    expect(result.allowlistedBeneficiaries).to.have.same.members(request.allowlistedBeneficiaries);
    expect(result.allowlistedContributors).to.have.same.members(request.allowlistedContributors);
    expect(result.balanceFee).to.equalFee(request.balanceFee);
    expect(result.dao).to.equal(ethers.constants.AddressZero);
    expect(result.daoToken).to.equal(ethers.constants.AddressZero);
    expect(result.depositFee).to.equalFee(request.depositFee);
    expect(result.donationMatchActive).to.equal(false);
    expect(result.donationMatchContract).to.equal(ethers.constants.AddressZero);
    expect(result.earlyLockedWithdrawFee).to.equalFee(request.earlyLockedWithdrawFee);
    expect(result.endowType).to.equal(request.endowType);
    expect(result.ignoreUserSplits).to.equal(request.ignoreUserSplits);
    expect(result.image).to.equal(request.image);
    expect(result.logo).to.equal(request.logo);
    expect(result.maturityAllowlist).to.have.same.members(request.maturityAllowlist);
    expect(result.maturityTime).to.equal(request.maturityTime);
    expect(result.multisig).to.equal(result.owner);
    expect(result.multisig).to.not.equal(ethers.constants.AddressZero);
    expect(result.name).to.equal(request.name);
    expect(result.parent).to.equal(request.parent);
    expect(result.pendingRedemptions).to.equal(0);
    expect(result.proposalLink).to.equal(request.proposalLink);
    expect(result.rebalance).to.deep.equal(await Registrar.getRebalanceParams());
    expect(result.referralId).to.equal(request.referralId);
    expect(result.sdgs).to.have.same.deep.members(request.sdgs.map((x) => BigNumber.from(x)));
    expect(result.settingsController.acceptedTokens).to.equalSettingsPermission(
      request.settingsController.acceptedTokens
    );
    expect(result.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
      request.settingsController.lockedInvestmentManagement
    );
    expect(result.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
      request.settingsController.liquidInvestmentManagement
    );
    expect(result.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
      request.settingsController.allowlistedBeneficiaries
    );
    expect(result.settingsController.allowlistedContributors).to.equalSettingsPermission(
      request.settingsController.allowlistedContributors
    );
    expect(result.settingsController.maturityAllowlist).to.equalSettingsPermission(
      request.settingsController.maturityAllowlist
    );
    expect(result.settingsController.maturityTime).to.equalSettingsPermission(
      request.settingsController.maturityTime
    );
    expect(result.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
      request.settingsController.earlyLockedWithdrawFee
    );
    expect(result.settingsController.withdrawFee).to.equalSettingsPermission(
      request.settingsController.withdrawFee
    );
    expect(result.settingsController.depositFee).to.equalSettingsPermission(
      request.settingsController.depositFee
    );
    expect(result.settingsController.balanceFee).to.equalSettingsPermission(
      request.settingsController.balanceFee
    );
    expect(result.settingsController.name).to.equalSettingsPermission(
      request.settingsController.name
    );
    expect(result.settingsController.image).to.equalSettingsPermission(
      request.settingsController.image
    );
    expect(result.settingsController.logo).to.equalSettingsPermission(
      request.settingsController.logo
    );
    expect(result.settingsController.sdgs).to.equalSettingsPermission(
      request.settingsController.sdgs
    );
    expect(result.settingsController.splitToLiquid).to.equalSettingsPermission(
      request.settingsController.splitToLiquid
    );
    expect(result.settingsController.ignoreUserSplits).to.equalSettingsPermission(
      request.settingsController.ignoreUserSplits
    );
    expect(result.splitToLiquid.defaultSplit).to.equal(request.splitToLiquid.defaultSplit);
    expect(result.splitToLiquid.max).to.equal(request.splitToLiquid.max);
    expect(result.splitToLiquid.min).to.equal(request.splitToLiquid.min);
    expect(result.tier).to.equal(request.tier);
    expect(result.withdrawFee).to.equalFee(request.withdrawFee);
  });

  it("should create a charity endowment if the caller is authorized and input parameters are valid", async () => {
    const request: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      endowType: 0, // Charity
      ignoreUserSplits: true,
      // `earlyLockedWithdrawFee` is not validated
      earlyLockedWithdrawFee: {
        bps: 1000,
        payoutAddress: ethers.constants.AddressZero,
      },
    };

    const tx = await facet.connect(charityApplications).createEndowment(request);
    const createEndowmentReceipt = await tx.wait();

    // Get the endowment ID from the event emitted in the transaction receipt
    const event = createEndowmentReceipt.events?.find((e) => e.event === "EndowmentCreated");
    let endowmentId = event?.args?.endowId ? BigNumber.from(event.args.endowId) : undefined;

    // verify endowment was created by checking the emitted event's parameter
    expect(endowmentId).to.exist;
    endowmentId = endowmentId!;

    const result = await state.getEndowmentDetails(endowmentId);

    expect(result.allowlistedBeneficiaries).to.have.same.members(request.allowlistedBeneficiaries);
    expect(result.allowlistedContributors).to.have.same.members(request.allowlistedContributors);
    expect(result.balanceFee).to.equalFee(request.balanceFee);
    expect(result.dao).to.equal(ethers.constants.AddressZero);
    expect(result.daoToken).to.equal(ethers.constants.AddressZero);
    expect(result.depositFee).to.equalFee(request.depositFee);
    expect(result.donationMatchActive).to.equal(false);
    // `donationMatchContract` is read from `registrar config > donationMatchCharitesContract`
    expect(result.donationMatchContract).to.equal(donationMatchCharitesContract.address);
    expect(result.earlyLockedWithdrawFee).to.equalFee(
      (await state.getConfig()).earlyLockedWithdrawFee
    );
    expect(result.endowType).to.equal(request.endowType);
    // `ignoreUserSplits` is set to `false` by default
    expect(result.ignoreUserSplits).to.equal(false);
    expect(result.image).to.equal(request.image);
    expect(result.logo).to.equal(request.logo);
    expect(result.maturityAllowlist).to.have.same.members(request.maturityAllowlist);
    expect(result.maturityTime).to.equal(request.maturityTime);
    expect(result.multisig).to.equal(result.owner);
    expect(result.multisig).to.not.equal(ethers.constants.AddressZero);
    expect(result.name).to.equal(request.name);
    expect(result.parent).to.equal(request.parent);
    expect(result.pendingRedemptions).to.equal(0);
    expect(result.proposalLink).to.equal(request.proposalLink);
    expect(result.rebalance).to.deep.equal(await Registrar.getRebalanceParams());
    expect(result.referralId).to.equal(request.referralId);
    expect(result.sdgs).to.have.same.deep.members(request.sdgs.map((x) => BigNumber.from(x)));
    expect(result.settingsController.acceptedTokens).to.equalSettingsPermission(
      request.settingsController.acceptedTokens
    );
    expect(result.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
      request.settingsController.lockedInvestmentManagement
    );
    expect(result.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
      request.settingsController.liquidInvestmentManagement
    );
    expect(result.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
      request.settingsController.allowlistedBeneficiaries
    );
    expect(result.settingsController.allowlistedContributors).to.equalSettingsPermission(
      request.settingsController.allowlistedContributors
    );
    expect(result.settingsController.maturityAllowlist).to.equalSettingsPermission(
      request.settingsController.maturityAllowlist
    );
    expect(result.settingsController.maturityTime).to.equalSettingsPermission(
      request.settingsController.maturityTime
    );
    expect(result.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
      request.settingsController.earlyLockedWithdrawFee
    );
    expect(result.settingsController.withdrawFee).to.equalSettingsPermission(
      request.settingsController.withdrawFee
    );
    expect(result.settingsController.depositFee).to.equalSettingsPermission(
      request.settingsController.depositFee
    );
    expect(result.settingsController.balanceFee).to.equalSettingsPermission(
      request.settingsController.balanceFee
    );
    expect(result.settingsController.name).to.equalSettingsPermission(
      request.settingsController.name
    );
    expect(result.settingsController.image).to.equalSettingsPermission(
      request.settingsController.image
    );
    expect(result.settingsController.logo).to.equalSettingsPermission(
      request.settingsController.logo
    );
    expect(result.settingsController.sdgs).to.equalSettingsPermission(
      request.settingsController.sdgs
    );
    expect(result.settingsController.splitToLiquid).to.equalSettingsPermission(
      request.settingsController.splitToLiquid
    );
    expect(result.settingsController.ignoreUserSplits).to.equalSettingsPermission(
      request.settingsController.ignoreUserSplits
    );
    expect(result.splitToLiquid.defaultSplit).to.equal(0);
    expect(result.splitToLiquid.max).to.equal(0);
    expect(result.splitToLiquid.min).to.equal(0);
    expect(result.tier).to.equal(request.tier);
    expect(result.withdrawFee).to.equalFee(request.withdrawFee);
  });
});
