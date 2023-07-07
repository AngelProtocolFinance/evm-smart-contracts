import {smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {
  AccountsUpdateEndowmentSettingsController,
  AccountsUpdateEndowmentSettingsController__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowmentSettingsController";
import {
  AccountStorage,
  LibAccounts,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsUpdateEndowmentSettingsController", function () {
  const {ethers} = hre;

  const charityId = 1;
  const normalEndowId = 2;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsUpdateEndowmentSettingsController;
  let state: TestFacetProxyContract;
  let oldNormalEndow: AccountStorage.EndowmentStruct;
  let oldCharity: AccountStorage.EndowmentStruct;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateEndowmentSettingsController__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: owner.address,
      version: "1",
      registrarContract: ethers.constants.AddressZero,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsUpdateEndowmentSettingsController__factory.connect(state.address, endowOwner);

    oldCharity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      maturityTime: 100,
      owner: endowOwner.address,
      maturityAllowlist: [genWallet().address],
    };
    oldNormalEndow = {
      ...oldCharity,
      endowType: 1,
    };
    await state.setEndowmentDetails(charityId, oldCharity);
    await state.setEndowmentDetails(normalEndowId, oldNormalEndow);
  });

  describe("updateEndowmentSettings", () => {
    let charityReq: AccountMessages.UpdateEndowmentSettingsRequestStruct;
    let normalEndowReq: AccountMessages.UpdateEndowmentSettingsRequestStruct;

    beforeEach(() => {
      charityReq = {
        id: charityId,
        allowlistedBeneficiaries: [genWallet().address],
        allowlistedContributors: [genWallet().address],
        donationMatchActive: true,
        ignoreUserSplits: true,
        maturity_allowlist_add: [genWallet().address],
        maturity_allowlist_remove: [oldCharity.maturityAllowlist[0]],
        maturityTime: 0,
        splitToLiquid: {defaultSplit: 40, max: 80, min: 20},
      };
      normalEndowReq = {
        ...charityReq,
        id: normalEndowId,
      };
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(normalEndowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.updateEndowmentSettings(normalEndowReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
      );
    });

    it("reverts if a normal endowment is updating its maturityAllowlist with a zero address value", async () => {
      const invalidRequest: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
        ...normalEndowReq,
        maturity_allowlist_add: [ethers.constants.AddressZero],
      };

      await expect(facet.updateEndowmentSettings(invalidRequest)).to.be.revertedWith(
        "InvalidAddress"
      );
    });

    it("changes nothing in charity settings if sender doesn't have necessary permissions", async () => {
      await expect(facet.connect(owner).updateEndowmentSettings(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityId);

      const updated = await state.getEndowmentDetails(charityId);

      expect(updated.allowlistedBeneficiaries).to.have.same.members(
        oldCharity.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(updated.allowlistedContributors).to.have.same.members(
        oldCharity.allowlistedContributors.map((x) => x.toString())
      );
      expect(updated.donationMatchActive).to.equal(oldCharity.donationMatchActive);
      expect(updated.ignoreUserSplits).to.equal(oldCharity.ignoreUserSplits);
      expect(updated.maturityAllowlist).to.have.same.members(
        oldCharity.maturityAllowlist.map((x) => x.toString())
      );
      expect(updated.maturityTime).to.equal(oldCharity.maturityTime);
      expect(updated.splitToLiquid.defaultSplit).to.equal(oldCharity.splitToLiquid.defaultSplit);
      expect(updated.splitToLiquid.max).to.equal(oldCharity.splitToLiquid.max);
      expect(updated.splitToLiquid.min).to.equal(oldCharity.splitToLiquid.min);
    });

    it("changes nothing in normal endowment settings if sender doesn't have necessary permissions", async () => {
      await expect(facet.connect(owner).updateEndowmentSettings(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowId);

      const updated = await state.getEndowmentDetails(normalEndowId);

      expect(updated.allowlistedBeneficiaries).to.have.same.members(
        oldNormalEndow.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(updated.allowlistedContributors).to.have.same.members(
        oldNormalEndow.allowlistedContributors.map((x) => x.toString())
      );
      expect(updated.donationMatchActive).to.equal(oldNormalEndow.donationMatchActive);
      expect(updated.ignoreUserSplits).to.equal(oldNormalEndow.ignoreUserSplits);
      expect(updated.maturityAllowlist).to.have.same.members(
        oldNormalEndow.maturityAllowlist.map((x) => x.toString())
      );
      expect(updated.maturityTime).to.equal(oldNormalEndow.maturityTime);
      expect(updated.splitToLiquid.defaultSplit).to.equal(
        oldNormalEndow.splitToLiquid.defaultSplit
      );
      expect(updated.splitToLiquid.max).to.equal(oldNormalEndow.splitToLiquid.max);
      expect(updated.splitToLiquid.min).to.equal(oldNormalEndow.splitToLiquid.min);
    });

    it("updates all charity settings if sender has the necessary permissions", async () => {
      await expect(facet.updateEndowmentSettings(charityReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(charityId, "splitToLiquid")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(charityId, "ignoreUserSplits")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityId);

      const updated = await state.getEndowmentDetails(charityId);

      expect(updated.allowlistedBeneficiaries).to.have.same.members(
        oldCharity.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(updated.allowlistedContributors).to.have.same.members(
        oldCharity.allowlistedContributors.map((x) => x.toString())
      );
      expect(updated.donationMatchActive).to.equal(oldCharity.donationMatchActive);
      expect(updated.ignoreUserSplits).to.equal(charityReq.ignoreUserSplits);
      expect(updated.maturityAllowlist).to.have.same.members(oldCharity.maturityAllowlist);
      expect(updated.maturityTime).to.equal(oldCharity.maturityTime);
      expect(updated.splitToLiquid.defaultSplit).to.equal(charityReq.splitToLiquid.defaultSplit);
      expect(updated.splitToLiquid.max).to.equal(charityReq.splitToLiquid.max);
      expect(updated.splitToLiquid.min).to.equal(charityReq.splitToLiquid.min);
    });

    it("updates all normal endowment settings if sender has the necessary permissions", async () => {
      await expect(facet.updateEndowmentSettings(normalEndowReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "maturityTime")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "allowlistedBeneficiaries")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "allowlistedContributors")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "maturityAllowlist")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "splitToLiquid")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "ignoreUserSplits")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowId);

      const updated = await state.getEndowmentDetails(normalEndowId);

      expect(updated.allowlistedBeneficiaries).to.have.same.members(
        normalEndowReq.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(updated.allowlistedContributors).to.have.same.members(
        normalEndowReq.allowlistedContributors.map((x) => x.toString())
      );
      expect(updated.donationMatchActive).to.equal(oldNormalEndow.donationMatchActive);
      expect(updated.ignoreUserSplits).to.equal(normalEndowReq.ignoreUserSplits);
      expect(updated.maturityAllowlist).to.contain.members(
        normalEndowReq.maturity_allowlist_add.map((x) => x.toString())
      );
      expect(updated.maturityAllowlist).to.not.contain.members(
        normalEndowReq.maturity_allowlist_remove.map((x) => x.toString())
      );
      expect(updated.maturityTime).to.equal(normalEndowReq.maturityTime);
      expect(updated.splitToLiquid.defaultSplit).to.equal(
        normalEndowReq.splitToLiquid.defaultSplit
      );
      expect(updated.splitToLiquid.max).to.equal(normalEndowReq.splitToLiquid.max);
      expect(updated.splitToLiquid.min).to.equal(normalEndowReq.splitToLiquid.min);
    });
  });

  describe("updateEndowmentController", () => {
    const settPermStruct: LibAccounts.SettingsPermissionStruct = {
      locked: true,
      delegate: {
        addr: genWallet().address,
        expires: 100,
      },
    };
    const request: AccountMessages.UpdateEndowmentControllerRequestStruct = {
      id: charityId,
      settingsController: {
        acceptedTokens: settPermStruct,
        lockedInvestmentManagement: settPermStruct,
        liquidInvestmentManagement: settPermStruct,
        allowlistedBeneficiaries: settPermStruct,
        allowlistedContributors: settPermStruct,
        maturityAllowlist: settPermStruct,
        maturityTime: settPermStruct,
        earlyLockedWithdrawFee: settPermStruct,
        withdrawFee: settPermStruct,
        depositFee: settPermStruct,
        balanceFee: settPermStruct,
        name: settPermStruct,
        image: settPermStruct,
        logo: settPermStruct,
        sdgs: settPermStruct,
        splitToLiquid: settPermStruct,
        ignoreUserSplits: settPermStruct,
      },
    };

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(request.id, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.updateEndowmentController(request)).to.be.revertedWith(
        "UpdatesAfterClosed"
      );
    });

    it("reverts if the sender is not the owner of the endowment", async () => {
      await expect(facet.connect(owner).updateEndowmentController(request)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("changes nothing in charity controller if fields cannot be changed", async () => {
      const lockedCharity: AccountStorage.EndowmentStruct = {...oldCharity};
      Object.values(lockedCharity.settingsController).forEach((setting) => {
        setting.locked = true;
      });
      await state.setEndowmentDetails(charityId, lockedCharity);

      await expect(facet.updateEndowmentController(request))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(charityId, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityId);

      const updated = await state.getEndowmentDetails(charityId);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        oldCharity.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        oldCharity.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        oldCharity.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        oldCharity.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        oldCharity.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        oldCharity.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        oldCharity.settingsController.maturityTime
      );
      expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        oldCharity.settingsController.earlyLockedWithdrawFee
      );
      expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
        oldCharity.settingsController.withdrawFee
      );
      expect(updated.settingsController.depositFee).to.equalSettingsPermission(
        oldCharity.settingsController.depositFee
      );
      expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
        oldCharity.settingsController.balanceFee
      );
      expect(updated.settingsController.name).to.equalSettingsPermission(
        oldCharity.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        oldCharity.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        oldCharity.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        oldCharity.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        oldCharity.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        oldCharity.settingsController.ignoreUserSplits
      );
    });

    it("changes nothing in normal endowment controller if fields cannot be changed", async () => {
      const lockedNormalEndow: AccountStorage.EndowmentStruct = {...oldNormalEndow};
      Object.values(lockedNormalEndow.settingsController).forEach((setting) => {
        setting.locked = true;
      });
      await state.setEndowmentDetails(normalEndowId, lockedNormalEndow);

      await expect(facet.updateEndowmentController({...request, id: normalEndowId}))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowId, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowId);

      const updated = await state.getEndowmentDetails(normalEndowId);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        oldNormalEndow.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        oldNormalEndow.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        oldNormalEndow.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        oldNormalEndow.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        oldNormalEndow.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        oldNormalEndow.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        oldNormalEndow.settingsController.maturityTime
      );
      expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        oldNormalEndow.settingsController.earlyLockedWithdrawFee
      );
      expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
        oldNormalEndow.settingsController.withdrawFee
      );
      expect(updated.settingsController.depositFee).to.equalSettingsPermission(
        oldNormalEndow.settingsController.depositFee
      );
      expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
        oldNormalEndow.settingsController.balanceFee
      );
      expect(updated.settingsController.name).to.equalSettingsPermission(
        oldNormalEndow.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        oldNormalEndow.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        oldNormalEndow.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        oldNormalEndow.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        oldNormalEndow.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        oldNormalEndow.settingsController.ignoreUserSplits
      );
    });
  });
});
