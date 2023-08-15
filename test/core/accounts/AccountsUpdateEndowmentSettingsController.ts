import {smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, wait} from "test/utils";
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
import {deployFacetAsProxy, updateAllSettings} from "./utils";

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
  });

  beforeEach(async () => {
    let Facet = new AccountsUpdateEndowmentSettingsController__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await wait(
      state.setConfig({
        owner: owner.address,
        version: "1",
        networkName: "",
        registrarContract: ethers.constants.AddressZero,
        nextAccountId: 1,
        reentrancyGuardLocked: false,
      })
    );

    facet = AccountsUpdateEndowmentSettingsController__factory.connect(state.address, endowOwner);

    await wait(state.setEndowmentDetails(charityId, oldCharity));
    await wait(state.setEndowmentDetails(normalEndowId, oldNormalEndow));
  });

  describe("updateEndowmentSettings", () => {
    let charityReq: AccountMessages.UpdateEndowmentSettingsRequestStruct;
    let normalEndowReq: AccountMessages.UpdateEndowmentSettingsRequestStruct;

    before(() => {
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
      await wait(
        state.setClosingEndowmentState(normalEndowId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
        })
      );
      await expect(facet.updateEndowmentSettings(normalEndowReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
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

    it("does not validate passed in address values", async () => {
      const request: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
        ...normalEndowReq,
        maturity_allowlist_add: [ethers.constants.AddressZero],
        maturity_allowlist_remove: [ethers.constants.AddressZero],
        allowlistedBeneficiaries: [ethers.constants.AddressZero],
        allowlistedContributors: [ethers.constants.AddressZero],
      };

      await expect(facet.updateEndowmentSettings(request))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(request.id, "allowlistedBeneficiaries")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(request.id, "allowlistedContributors")
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(request.id, "maturityAllowlist");
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
    const charityReq: AccountMessages.UpdateEndowmentControllerRequestStruct = {
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
    const normalEndowReq: AccountMessages.UpdateEndowmentControllerRequestStruct = {
      ...charityReq,
      id: normalEndowId,
    };

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(charityReq.id, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
        })
      );
      await expect(facet.updateEndowmentController(charityReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
      );
    });

    it("changes nothing in charity controller if fields are locked", async () => {
      const lockedCharity = await updateAllSettings(charityId, {locked: true}, state);

      await expect(facet.updateEndowmentController(charityReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(charityReq.id, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        lockedCharity.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        lockedCharity.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        lockedCharity.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        lockedCharity.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        lockedCharity.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        lockedCharity.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        lockedCharity.settingsController.maturityTime
      );
      expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        lockedCharity.settingsController.earlyLockedWithdrawFee
      );
      expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
        lockedCharity.settingsController.withdrawFee
      );
      expect(updated.settingsController.depositFee).to.equalSettingsPermission(
        lockedCharity.settingsController.depositFee
      );
      expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
        lockedCharity.settingsController.balanceFee
      );
      expect(updated.settingsController.name).to.equalSettingsPermission(
        lockedCharity.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        lockedCharity.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        lockedCharity.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        lockedCharity.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        lockedCharity.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        lockedCharity.settingsController.ignoreUserSplits
      );
    });

    it("changes nothing in normal endowment controller if fields are locked", async () => {
      const lockedNormalEndow = await updateAllSettings(normalEndowId, {locked: true}, state);

      await expect(facet.updateEndowmentController(normalEndowReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowReq.id, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.maturityTime
      );
      expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.earlyLockedWithdrawFee
      );
      expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.withdrawFee
      );
      expect(updated.settingsController.depositFee).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.depositFee
      );
      expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.balanceFee
      );
      expect(updated.settingsController.name).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        lockedNormalEndow.settingsController.ignoreUserSplits
      );
    });

    it("updates all charity's controllers except fee-related ones", async () => {
      await expect(facet.updateEndowmentController(charityReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(charityReq.id, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        charityReq.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        charityReq.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        charityReq.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        charityReq.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        charityReq.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        charityReq.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        charityReq.settingsController.maturityTime
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
        charityReq.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        charityReq.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        charityReq.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        charityReq.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        charityReq.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        charityReq.settingsController.ignoreUserSplits
      );
    });

    it("updates all normal endowment's controllers", async () => {
      await expect(facet.updateEndowmentController(normalEndowReq))
        .to.emit(facet, "EndowmentSettingUpdated")
        .withArgs(normalEndowReq.id, "endowmentController")
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
        normalEndowReq.settingsController.acceptedTokens
      );
      expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
        normalEndowReq.settingsController.lockedInvestmentManagement
      );
      expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
        normalEndowReq.settingsController.liquidInvestmentManagement
      );
      expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
        normalEndowReq.settingsController.allowlistedBeneficiaries
      );
      expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
        normalEndowReq.settingsController.allowlistedContributors
      );
      expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
        normalEndowReq.settingsController.maturityAllowlist
      );
      expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
        normalEndowReq.settingsController.maturityTime
      );
      expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        normalEndowReq.settingsController.earlyLockedWithdrawFee
      );
      expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
        normalEndowReq.settingsController.withdrawFee
      );
      expect(updated.settingsController.depositFee).to.equalSettingsPermission(
        normalEndowReq.settingsController.depositFee
      );
      expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
        normalEndowReq.settingsController.balanceFee
      );
      expect(updated.settingsController.name).to.equalSettingsPermission(
        normalEndowReq.settingsController.name
      );
      expect(updated.settingsController.image).to.equalSettingsPermission(
        normalEndowReq.settingsController.image
      );
      expect(updated.settingsController.logo).to.equalSettingsPermission(
        normalEndowReq.settingsController.logo
      );
      expect(updated.settingsController.sdgs).to.equalSettingsPermission(
        normalEndowReq.settingsController.sdgs
      );
      expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
        normalEndowReq.settingsController.splitToLiquid
      );
      expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        normalEndowReq.settingsController.ignoreUserSplits
      );
    });
  });

  describe("updateFeeSettings", () => {
    const defaultFee: LibAccounts.FeeSettingStruct = {
      bps: 2000,
      payoutAddress: genWallet().address,
    };
    const request: AccountMessages.UpdateFeeSettingRequestStruct = {
      id: normalEndowId,
      earlyLockedWithdrawFee: defaultFee,
      depositFee: defaultFee,
      withdrawFee: defaultFee,
      balanceFee: defaultFee,
    };

    it("reverts if updating charity fees", async () => {
      await expect(
        facet.connect(owner).updateFeeSettings({...request, id: charityId})
      ).to.be.revertedWith("Charity Endowments may not change endowment fees");
    });

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(request.id, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
        })
      );
      await expect(facet.updateFeeSettings(request)).to.be.revertedWith("UpdatesAfterClosed");
    });

    it("changes nothing in endowment fees if fields are locked", async () => {
      const lockedNormalEndow = await updateAllSettings(normalEndowId, {locked: true}, state);

      await expect(facet.updateFeeSettings(request))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(request.id);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.earlyLockedWithdrawFee).to.equalFee(lockedNormalEndow.earlyLockedWithdrawFee);
      expect(updated.withdrawFee).to.equalFee(lockedNormalEndow.withdrawFee);
      expect(updated.depositFee).to.equalFee(lockedNormalEndow.depositFee);
      expect(updated.balanceFee).to.equalFee(lockedNormalEndow.balanceFee);
    });

    it("updates all normal endowment's fees", async () => {
      await expect(facet.updateFeeSettings(request))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(request.id);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.earlyLockedWithdrawFee).to.equalFee(request.earlyLockedWithdrawFee);
      expect(updated.withdrawFee).to.equalFee(request.withdrawFee);
      expect(updated.depositFee).to.equalFee(request.depositFee);
      expect(updated.balanceFee).to.equalFee(request.balanceFee);
    });
  });
});
