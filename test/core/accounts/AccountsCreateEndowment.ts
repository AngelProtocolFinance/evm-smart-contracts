import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {DEFAULT_REGISTRAR_CONFIG, wait} from "test/utils";
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
import {FeeTypes, genWallet, getProxyAdminOwner, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsCreateEndowment", function () {
  const {ethers} = hre;

  const endowmentOwner = genWallet().address;

  const expectedNextAccountId = 1;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let charityApplications: SignerWithAddress;
  let facet: AccountsCreateEndowment;
  let state: TestFacetProxyContract;
  let createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct;
  let registrarFake: FakeContract<Registrar>;
  let gasFwdFactoryFake: FakeContract<GasFwdFactory>;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    charityApplications = signers.deployer;

    proxyAdmin = await getProxyAdminOwner(hre);

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
      maturityAllowlist: [],
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

    gasFwdFactoryFake = await smock.fake<GasFwdFactory>(new GasFwdFactory__factory());
    gasFwdFactoryFake.create.returns(ethers.constants.AddressZero);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });
    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      charityApplications: charityApplications.address,
      multisigFactory: endowmentFactoryFake.address,
      gasFwdFactory: gasFwdFactoryFake.address,
    };
    registrarFake.queryConfig.returns(config);
  });

  beforeEach(async function () {
    let Facet = new AccountsCreateEndowment__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await wait(
      state.setConfig({
        owner: owner.address,
        version: "1",
        networkName: "Polygon",
        registrarContract: registrarFake.address,
        nextAccountId: expectedNextAccountId,
        reentrancyGuardLocked: false,
      })
    );

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

    await expect(facet.connect(charityApplications).createEndowment(request))
      .to.emit(facet, "EndowmentCreated")
      .withArgs(expectedNextAccountId, request.endowType);

    const result = await state.getEndowmentDetails(expectedNextAccountId);

    expect(result.dao).to.equal(ethers.constants.AddressZero);
    expect(result.balanceFee).to.equalFee(request.balanceFee);
    expect(result.depositFee).to.equalFee(request.depositFee);
    expect(result.withdrawFee).to.equalFee(request.withdrawFee);
    expect(result.earlyLockedWithdrawFee).to.equalFee(request.earlyLockedWithdrawFee);
    expect(result.donationMatchActive).to.equal(false);
    expect(result.donationMatch).to.equal(ethers.constants.AddressZero);
    expect(result.endowType).to.equal(request.endowType);
    expect(result.ignoreUserSplits).to.equal(request.ignoreUserSplits);
    expect(result.image).to.equal(request.image);
    expect(result.logo).to.equal(request.logo);
    expect(result.maturityTime).to.equal(request.maturityTime);
    expect(result.multisig).to.equal(result.owner);
    expect(result.multisig).to.not.equal(ethers.constants.AddressZero);
    expect(result.name).to.equal(request.name);
    expect(result.parent).to.equal(request.parent);
    expect(result.proposalLink).to.equal(request.proposalLink);
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
  });

  it("should create a charity endowment if the caller is authorized and input parameters are valid", async () => {
    const request: AccountMessages.CreateEndowmentRequestStruct = {
      ...createEndowmentRequest,
      endowType: 0, // Charity
      ignoreUserSplits: true,
      balanceFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
      depositFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
      withdrawFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
      earlyLockedWithdrawFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
    };

    await expect(facet.connect(charityApplications).createEndowment(request))
      .to.emit(facet, "EndowmentCreated")
      .withArgs(expectedNextAccountId, 0);

    const result = await state.getEndowmentDetails(expectedNextAccountId);

    expect(result.dao).to.equal(ethers.constants.AddressZero);
    expect(result.donationMatchActive).to.equal(false);
    expect(result.donationMatch).to.equal(ethers.constants.AddressZero);
    // no endowment-level fees are accepted for Charity Endowments regardless of what is passed
    // they should all be set to zero
    expect(result.balanceFee).to.equalFee({bps: 0, payoutAddress: ethers.constants.AddressZero});
    expect(result.depositFee).to.equalFee({bps: 0, payoutAddress: ethers.constants.AddressZero});
    expect(result.withdrawFee).to.equalFee({bps: 0, payoutAddress: ethers.constants.AddressZero});
    expect(result.earlyLockedWithdrawFee).to.equalFee({
      bps: 0,
      payoutAddress: ethers.constants.AddressZero,
    });
    expect(result.endowType).to.equal(request.endowType);
    expect(result.ignoreUserSplits).to.equal(request.ignoreUserSplits);
    expect(result.image).to.equal(request.image);
    expect(result.logo).to.equal(request.logo);
    expect(result.maturityTime).to.equal(request.maturityTime);
    expect(result.multisig).to.equal(result.owner);
    expect(result.multisig).to.not.equal(ethers.constants.AddressZero);
    expect(result.name).to.equal(request.name);
    expect(result.parent).to.equal(request.parent);
    expect(result.proposalLink).to.equal(request.proposalLink);
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

    const updatedConfig = await state.getConfig();
    expect(updatedConfig.nextAccountId).to.equal(expectedNextAccountId + 1);
  });
});
