import {smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {
  AccountsUpdateEndowmentSettingsController,
  AccountsUpdateEndowmentSettingsController__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowmentSettingsController";
import "../../utils/setup";
import {DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet} from "utils";
import {BigNumber} from "ethers";

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
    let signers: SignerWithAddress[];
    [owner, proxyAdmin, endowOwner, ...signers] = await ethers.getSigners();
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
  });

  describe("updateEndowmentSettings", () => {
    const charityReq: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
      id: charityId,
      allowlistedBeneficiaries: [genWallet().address],
      allowlistedContributors: [genWallet().address],
      donationMatchActive: true,
      ignoreUserSplits: true,
      maturity_allowlist_add: [genWallet().address],
      maturity_allowlist_remove: [genWallet().address],
      maturityTime: 0,
      splitToLiquid: {defaultSplit: 40, max: 80, min: 20},
    };
    const normalEndowReq: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
      ...charityReq,
      id: normalEndowId,
    };

    before(() => {
      oldCharity = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        maturityTime: 100,
        owner: endowOwner.address,
        maturityAllowlist: [...normalEndowReq.maturity_allowlist_remove],
      };
      oldNormalEndow = {
        ...oldCharity,
        endowType: 1,
      };
    });

    beforeEach(async () => {
      await state.setEndowmentDetails(charityId, oldCharity);
      await state.setEndowmentDetails(normalEndowId, oldNormalEndow);
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

      const updatedCharity = await state.getEndowmentDetails(charityId);

      expect(updatedCharity.allowlistedBeneficiaries).to.have.same.members(
        oldCharity.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(updatedCharity.allowlistedContributors).to.have.same.members(
        oldCharity.allowlistedContributors.map((x) => x.toString())
      );
      expect(updatedCharity.donationMatchActive).to.equal(oldCharity.donationMatchActive);
      expect(updatedCharity.ignoreUserSplits).to.equal(oldCharity.ignoreUserSplits);
      expect(updatedCharity.maturityAllowlist).to.have.same.members(
        oldCharity.maturityAllowlist.map((x) => x.toString())
      );
      expect(updatedCharity.maturityTime).to.equal(oldCharity.maturityTime);
      expect(updatedCharity.splitToLiquid.defaultSplit).to.equal(
        oldCharity.splitToLiquid.defaultSplit
      );
      expect(updatedCharity.splitToLiquid.max).to.equal(oldCharity.splitToLiquid.max);
      expect(updatedCharity.splitToLiquid.min).to.equal(oldCharity.splitToLiquid.min);
    });

    it("changes nothing in normal endowment settings if sender doesn't have necessary permissions", async () => {
      await expect(facet.connect(owner).updateEndowmentSettings(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowId);

      const newEndow = await state.getEndowmentDetails(normalEndowId);

      expect(newEndow.allowlistedBeneficiaries).to.have.same.members(
        oldNormalEndow.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(newEndow.allowlistedContributors).to.have.same.members(
        oldNormalEndow.allowlistedContributors.map((x) => x.toString())
      );
      expect(newEndow.donationMatchActive).to.equal(oldNormalEndow.donationMatchActive);
      expect(newEndow.ignoreUserSplits).to.equal(oldNormalEndow.ignoreUserSplits);
      expect(newEndow.maturityAllowlist).to.have.same.members(
        oldNormalEndow.maturityAllowlist.map((x) => x.toString())
      );
      expect(newEndow.maturityTime).to.equal(oldNormalEndow.maturityTime);
      expect(newEndow.splitToLiquid.defaultSplit).to.equal(
        oldNormalEndow.splitToLiquid.defaultSplit
      );
      expect(newEndow.splitToLiquid.max).to.equal(oldNormalEndow.splitToLiquid.max);
      expect(newEndow.splitToLiquid.min).to.equal(oldNormalEndow.splitToLiquid.min);
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

      const newEndow = await state.getEndowmentDetails(normalEndowId);

      expect(newEndow.allowlistedBeneficiaries).to.have.same.members(
        normalEndowReq.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(newEndow.allowlistedContributors).to.have.same.members(
        normalEndowReq.allowlistedContributors.map((x) => x.toString())
      );
      expect(newEndow.donationMatchActive).to.equal(oldNormalEndow.donationMatchActive);
      expect(newEndow.ignoreUserSplits).to.equal(normalEndowReq.ignoreUserSplits);
      expect(newEndow.maturityAllowlist).to.contain.members(
        normalEndowReq.maturity_allowlist_add.map((x) => x.toString())
      );
      expect(newEndow.maturityAllowlist).to.not.contain.members(
        normalEndowReq.maturity_allowlist_remove.map((x) => x.toString())
      );
      expect(newEndow.maturityTime).to.equal(normalEndowReq.maturityTime);
      expect(newEndow.splitToLiquid.defaultSplit).to.equal(
        normalEndowReq.splitToLiquid.defaultSplit
      );
      expect(newEndow.splitToLiquid.max).to.equal(normalEndowReq.splitToLiquid.max);
      expect(newEndow.splitToLiquid.min).to.equal(normalEndowReq.splitToLiquid.min);
    });
  });
});
