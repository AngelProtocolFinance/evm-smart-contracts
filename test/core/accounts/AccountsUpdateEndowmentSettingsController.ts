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

  const endowId = 1;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let facet: AccountsUpdateEndowmentSettingsController;
  let state: TestFacetProxyContract;
  let oldEndowment: AccountStorage.EndowmentStruct;

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

    oldEndowment = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      endowType: 1,
      owner: endowOwner.address,
    };
    await state.setEndowmentDetails(endowId, oldEndowment);

    facet = AccountsUpdateEndowmentSettingsController__factory.connect(state.address, endowOwner);
  });

  describe("updateEndowmentSettings", () => {
    let updateEndowmentSettingsRequest: AccountMessages.UpdateEndowmentSettingsRequestStruct;

    beforeEach(() => {
      updateEndowmentSettingsRequest = {
        id: endowId,
        allowlistedBeneficiaries: [genWallet().address],
        allowlistedContributors: [genWallet().address],
        donationMatchActive: true,
        ignoreUserSplits: true,
        maturity_allowlist_add: [genWallet().address],
        maturity_allowlist_remove: [genWallet().address],
        maturityTime: 100,
        splitToLiquid: {defaultSplit: 40, max: 80, min: 20},
      };
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(endowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.updateEndowmentSettings(updateEndowmentSettingsRequest)
      ).to.be.revertedWith("UpdatesAfterClosed");
    });

    it("reverts if a normal endowment is updating its maturityAllowlist with a zero address value", async () => {
      const request: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
        ...updateEndowmentSettingsRequest,
        maturityTime: 0,
        maturity_allowlist_add: [ethers.constants.AddressZero],
      };

      await expect(facet.updateEndowmentSettings(request)).to.be.revertedWith("InvalidAddress");
    });

    it("changes nothing in charity settings if sender doesn't have necessary permissions", async () => {
      const tx = await facet.connect(owner).updateEndowmentSettings(updateEndowmentSettingsRequest);
      const createEndowmentReceipt = await tx.wait();

      // Get the endowment ID from the event emitted in the transaction receipt
      const event = createEndowmentReceipt.events?.find((e) => e.event === "EndowmentUpdated");

      // verify endowment was created by checking the emitted event's parameter
      expect(event).to.exist;
      expect(event?.args).to.exist;
      expect(BigNumber.from(event!.args!.endowId)).to.equal(endowId);

      const newEndow = await state.getEndowmentDetails(endowId);

      expect(newEndow.allowlistedBeneficiaries).to.have.same.members(
        oldEndowment.allowlistedBeneficiaries.map((x) => x.toString())
      );
      expect(newEndow.allowlistedContributors).to.have.same.members(
        oldEndowment.allowlistedContributors.map((x) => x.toString())
      );
      expect(newEndow.donationMatchActive).to.equal(oldEndowment.donationMatchActive);
      expect(newEndow.ignoreUserSplits).to.equal(oldEndowment.ignoreUserSplits);
      expect(newEndow.maturityAllowlist).to.have.same.members(
        oldEndowment.maturityAllowlist.map((x) => x.toString())
      );
      expect(newEndow.maturityTime).to.equal(oldEndowment.maturityTime);
      expect(newEndow.splitToLiquid.defaultSplit).to.equal(oldEndowment.splitToLiquid.defaultSplit);
      expect(newEndow.splitToLiquid.max).to.equal(oldEndowment.splitToLiquid.max);
      expect(newEndow.splitToLiquid.min).to.equal(oldEndowment.splitToLiquid.min);
    });
  });
});
