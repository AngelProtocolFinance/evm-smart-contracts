import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {
  AccountsUpdateEndowments,
  AccountsUpdateEndowments__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowments";
import {
  AccountStorage,
  LibAccounts,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";
import {BigNumber, BigNumberish} from "ethers";

use(smock.matchers);

describe("AccountsUpdateEndowments", function () {
  const {ethers} = hre;

  const charityId = 1;
  const normalEndowId = 2;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let delegate: SignerWithAddress;

  let facet: AccountsUpdateEndowments;
  let state: TestFacetProxyContract;
  let oldNormalEndow: AccountStorage.EndowmentStruct;
  let oldCharity: AccountStorage.EndowmentStruct;

  let registrarFake: FakeContract<Registrar>;

  /**
   * Updates all endowment's settings' delegate in a way that has no side-effects
   * @param endowId ID of the endowment
   * @param delegate new delegate to set for all settings
   * @returns the updated endowment data with all settings' delegates updated
   */
  async function updateDelegate(endowId: BigNumberish, delegate: string) {
    const oldEndow = await state.getEndowmentDetails(endowId);
    const lockedEndow: AccountStorage.EndowmentStruct = {...oldEndow};
    lockedEndow.settingsController = (
      Object.entries(lockedEndow.settingsController) as [
        keyof LibAccounts.SettingsControllerStruct,
        LibAccounts.SettingsPermissionStruct
      ][]
    ).reduce((controller, [key, curSetting]) => {
      controller[key] = {
        locked: curSetting.locked,
        delegate: {addr: delegate, expires: curSetting.delegate.expires},
      };
      return controller;
    }, {} as LibAccounts.SettingsControllerStruct);

    await state.setEndowmentDetails(endowId, lockedEndow);
    return lockedEndow;
  }

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    delegate = signers.apTeam2;

    oldCharity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: endowOwner.address,
      maturityAllowlist: [genWallet().address],
    };
    oldNormalEndow = {
      ...oldCharity,
      endowType: 1,
    };
  });

  beforeEach(async () => {
    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    let Facet = new AccountsUpdateEndowments__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: accOwner.address,
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

    facet = AccountsUpdateEndowments__factory.connect(state.address, endowOwner);

    await state.setEndowmentDetails(charityId, oldCharity);
    await state.setEndowmentDetails(normalEndowId, oldNormalEndow);
  });

  describe("updateEndowmentDetails", () => {
    const charityReq: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
      id: charityId,
      owner: genWallet().address,
      name: "charity",
      sdgs: [2, 1],
      logo: "logo",
      image: "image",
      rebalance: {
        basis: 100,
        rebalanceLiquidProfits: false,
        lockedRebalanceToLiquid: 75,
        interestDistribution: 20,
        lockedPrincipleToLiquid: false,
        principleDistribution: 0,
      },
    };
    const normalEndowReq: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
      id: normalEndowId,
      owner: genWallet().address,
      name: "normal",
      sdgs: [4, 3],
      logo: "logo2",
      image: "image2",
      rebalance: {
        basis: 100,
        rebalanceLiquidProfits: true,
        lockedRebalanceToLiquid: 60,
        interestDistribution: 19,
        lockedPrincipleToLiquid: true,
        principleDistribution: 1,
      },
    };

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(normalEndowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.updateEndowmentDetails(normalEndowReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
      );
    });

    it("reverts if a charity is updating its SDGs with an empty array", async () => {
      const invalidRequest: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...charityReq,
        sdgs: [],
      };
      await expect(facet.updateEndowmentDetails(invalidRequest)).to.be.revertedWith(
        "InvalidInputs"
      );
    });

    [[0], [18], [0, 18], [0, 5], [5, 18]].forEach((sdgs) => {
      it(`reverts if a charity is updating its SDGs with an array containing invalid values: [${sdgs}]`, async () => {
        const invalidRequest: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
          ...charityReq,
          sdgs,
        };
        await expect(facet.updateEndowmentDetails(invalidRequest)).to.be.revertedWith(
          "InvalidInputs"
        );
      });
    });

    it("changes nothing in charity settings if sender doesn't have necessary permissions", async () => {
      await expect(facet.connect(accOwner).updateEndowmentDetails(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

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
      await expect(facet.connect(accOwner).updateEndowmentDetails(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

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

    it("updates all charity settings except those updateable only by owner", async () => {
      await updateDelegate(await charityReq.id, delegate.address);

      await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.image).to.equal(charityReq.image);
      expect(updated.logo).to.equal(charityReq.logo);
      expect(updated.name).to.equal(charityReq.name);
      expect(updated.owner).to.equal(oldCharity.owner);
      expect(updated.rebalance).to.equalRebalance(oldCharity.rebalance);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(
        [...charityReq.sdgs].sort()
      );
    });

    it("updates all normal endowment settings except those updateable only by owner", async () => {
      await updateDelegate(await normalEndowReq.id, delegate.address);

      await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.image).to.equal(normalEndowReq.image);
      expect(updated.logo).to.equal(normalEndowReq.logo);
      expect(updated.name).to.equal(normalEndowReq.name);
      expect(updated.owner).to.equal(oldNormalEndow.owner);
      expect(updated.rebalance).to.equalRebalance(oldNormalEndow.rebalance);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.members(normalEndowReq.sdgs);
    });

    //   it("updates all normal endowment settings if sender has the necessary permissions", async () => {
    //     await expect(facet.updateEndowmentDetails(normalEndowReq))
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "maturityTime")
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "allowlistedBeneficiaries")
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "allowlistedContributors")
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "maturityAllowlist")
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "splitToLiquid")
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowId, "ignoreUserSplits")
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(normalEndowId);

    //     const updated = await state.getEndowmentDetails(normalEndowId);

    //     expect(updated.allowlistedBeneficiaries).to.have.same.members(
    //       normalEndowReq.allowlistedBeneficiaries.map((x) => x.toString())
    //     );
    //     expect(updated.allowlistedContributors).to.have.same.members(
    //       normalEndowReq.allowlistedContributors.map((x) => x.toString())
    //     );
    //     expect(updated.donationMatchActive).to.equal(oldNormalEndow.donationMatchActive);
    //     expect(updated.ignoreUserSplits).to.equal(normalEndowReq.ignoreUserSplits);
    //     expect(updated.maturityAllowlist).to.contain.members(
    //       normalEndowReq.maturity_allowlist_add.map((x) => x.toString())
    //     );
    //     expect(updated.maturityAllowlist).to.not.contain.members(
    //       normalEndowReq.maturity_allowlist_remove.map((x) => x.toString())
    //     );
    //     expect(updated.maturityTime).to.equal(normalEndowReq.maturityTime);
    //     expect(updated.splitToLiquid.defaultSplit).to.equal(
    //       normalEndowReq.splitToLiquid.defaultSplit
    //     );
    //     expect(updated.splitToLiquid.max).to.equal(normalEndowReq.splitToLiquid.max);
    //     expect(updated.splitToLiquid.min).to.equal(normalEndowReq.splitToLiquid.min);
    //   });
    // });

    // describe("updateEndowmentController", () => {
    //   const settPermStruct: LibAccounts.SettingsPermissionStruct = {
    //     locked: true,
    //     delegate: {
    //       addr: genWallet().address,
    //       expires: 100,
    //     },
    //   };
    //   const charityReq: AccountMessages.UpdateEndowmentControllerRequestStruct = {
    //     id: charityId,
    //     settingsController: {
    //       acceptedTokens: settPermStruct,
    //       lockedInvestmentManagement: settPermStruct,
    //       liquidInvestmentManagement: settPermStruct,
    //       allowlistedBeneficiaries: settPermStruct,
    //       allowlistedContributors: settPermStruct,
    //       maturityAllowlist: settPermStruct,
    //       maturityTime: settPermStruct,
    //       earlyLockedWithdrawFee: settPermStruct,
    //       withdrawFee: settPermStruct,
    //       depositFee: settPermStruct,
    //       balanceFee: settPermStruct,
    //       name: settPermStruct,
    //       image: settPermStruct,
    //       logo: settPermStruct,
    //       sdgs: settPermStruct,
    //       splitToLiquid: settPermStruct,
    //       ignoreUserSplits: settPermStruct,
    //     },
    //   };
    //   const normalEndowReq: AccountMessages.UpdateEndowmentControllerRequestStruct = {
    //     ...charityReq,
    //     id: normalEndowId,
    //   };

    //   it("reverts if the endowment is closed", async () => {
    //     await state.setClosingEndowmentState(charityReq.id, true, {
    //       enumData: 0,
    //       data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
    //     });
    //     await expect(facet.updateEndowmentController(charityReq)).to.be.revertedWith(
    //       "UpdatesAfterClosed"
    //     );
    //   });

    //   it("reverts if the sender is not the owner of the endowment", async () => {
    //     await expect(facet.connect(owner).updateEndowmentController(charityReq)).to.be.revertedWith(
    //       "Unauthorized"
    //     );
    //   });

    //   it("changes nothing in charity controller if fields cannot be changed", async () => {
    //     const lockedCharity = await lockSettings(charityId, oldCharity);

    //     await expect(facet.updateEndowmentController(charityReq))
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(charityReq.id, "endowmentController")
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(charityReq.id);

    //     const updated = await state.getEndowmentDetails(charityReq.id);

    //     expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
    //       lockedCharity.settingsController.acceptedTokens
    //     );
    //     expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
    //       lockedCharity.settingsController.lockedInvestmentManagement
    //     );
    //     expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
    //       lockedCharity.settingsController.liquidInvestmentManagement
    //     );
    //     expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
    //       lockedCharity.settingsController.allowlistedBeneficiaries
    //     );
    //     expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
    //       lockedCharity.settingsController.allowlistedContributors
    //     );
    //     expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
    //       lockedCharity.settingsController.maturityAllowlist
    //     );
    //     expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
    //       lockedCharity.settingsController.maturityTime
    //     );
    //     expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
    //       lockedCharity.settingsController.earlyLockedWithdrawFee
    //     );
    //     expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
    //       lockedCharity.settingsController.withdrawFee
    //     );
    //     expect(updated.settingsController.depositFee).to.equalSettingsPermission(
    //       lockedCharity.settingsController.depositFee
    //     );
    //     expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
    //       lockedCharity.settingsController.balanceFee
    //     );
    //     expect(updated.settingsController.name).to.equalSettingsPermission(
    //       lockedCharity.settingsController.name
    //     );
    //     expect(updated.settingsController.image).to.equalSettingsPermission(
    //       lockedCharity.settingsController.image
    //     );
    //     expect(updated.settingsController.logo).to.equalSettingsPermission(
    //       lockedCharity.settingsController.logo
    //     );
    //     expect(updated.settingsController.sdgs).to.equalSettingsPermission(
    //       lockedCharity.settingsController.sdgs
    //     );
    //     expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
    //       lockedCharity.settingsController.splitToLiquid
    //     );
    //     expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
    //       lockedCharity.settingsController.ignoreUserSplits
    //     );
    //   });

    //   it("changes nothing in normal endowment controller if fields cannot be changed", async () => {
    //     const lockedNormalEndow = await lockSettings(normalEndowId, oldNormalEndow);

    //     await expect(facet.updateEndowmentController(normalEndowReq))
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowReq.id, "endowmentController")
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(normalEndowReq.id);

    //     const updated = await state.getEndowmentDetails(normalEndowReq.id);

    //     expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.acceptedTokens
    //     );
    //     expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.lockedInvestmentManagement
    //     );
    //     expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.liquidInvestmentManagement
    //     );
    //     expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.allowlistedBeneficiaries
    //     );
    //     expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.allowlistedContributors
    //     );
    //     expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.maturityAllowlist
    //     );
    //     expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.maturityTime
    //     );
    //     expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.earlyLockedWithdrawFee
    //     );
    //     expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.withdrawFee
    //     );
    //     expect(updated.settingsController.depositFee).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.depositFee
    //     );
    //     expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.balanceFee
    //     );
    //     expect(updated.settingsController.name).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.name
    //     );
    //     expect(updated.settingsController.image).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.image
    //     );
    //     expect(updated.settingsController.logo).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.logo
    //     );
    //     expect(updated.settingsController.sdgs).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.sdgs
    //     );
    //     expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.splitToLiquid
    //     );
    //     expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
    //       lockedNormalEndow.settingsController.ignoreUserSplits
    //     );
    //   });

    //   it("updates all charity's controllers", async () => {
    //     await expect(facet.updateEndowmentController(charityReq))
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(charityReq.id, "endowmentController")
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(charityReq.id);

    //     const updated = await state.getEndowmentDetails(charityReq.id);

    //     expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
    //       charityReq.settingsController.acceptedTokens
    //     );
    //     expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
    //       charityReq.settingsController.lockedInvestmentManagement
    //     );
    //     expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
    //       charityReq.settingsController.liquidInvestmentManagement
    //     );
    //     expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
    //       charityReq.settingsController.allowlistedBeneficiaries
    //     );
    //     expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
    //       charityReq.settingsController.allowlistedContributors
    //     );
    //     expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
    //       charityReq.settingsController.maturityAllowlist
    //     );
    //     expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
    //       charityReq.settingsController.maturityTime
    //     );
    //     expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
    //       oldCharity.settingsController.earlyLockedWithdrawFee
    //     );
    //     expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
    //       charityReq.settingsController.withdrawFee
    //     );
    //     expect(updated.settingsController.depositFee).to.equalSettingsPermission(
    //       charityReq.settingsController.depositFee
    //     );
    //     expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
    //       charityReq.settingsController.balanceFee
    //     );
    //     expect(updated.settingsController.name).to.equalSettingsPermission(
    //       charityReq.settingsController.name
    //     );
    //     expect(updated.settingsController.image).to.equalSettingsPermission(
    //       charityReq.settingsController.image
    //     );
    //     expect(updated.settingsController.logo).to.equalSettingsPermission(
    //       charityReq.settingsController.logo
    //     );
    //     expect(updated.settingsController.sdgs).to.equalSettingsPermission(
    //       charityReq.settingsController.sdgs
    //     );
    //     expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
    //       charityReq.settingsController.splitToLiquid
    //     );
    //     expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
    //       charityReq.settingsController.ignoreUserSplits
    //     );
    //   });

    //   it("updates all normal endowment's controllers", async () => {
    //     await expect(facet.updateEndowmentController(normalEndowReq))
    //       .to.emit(facet, "EndowmentSettingUpdated")
    //       .withArgs(normalEndowReq.id, "endowmentController")
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(normalEndowReq.id);

    //     const updated = await state.getEndowmentDetails(normalEndowReq.id);

    //     expect(updated.settingsController.acceptedTokens).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.acceptedTokens
    //     );
    //     expect(updated.settingsController.lockedInvestmentManagement).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.lockedInvestmentManagement
    //     );
    //     expect(updated.settingsController.liquidInvestmentManagement).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.liquidInvestmentManagement
    //     );
    //     expect(updated.settingsController.allowlistedBeneficiaries).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.allowlistedBeneficiaries
    //     );
    //     expect(updated.settingsController.allowlistedContributors).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.allowlistedContributors
    //     );
    //     expect(updated.settingsController.maturityAllowlist).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.maturityAllowlist
    //     );
    //     expect(updated.settingsController.maturityTime).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.maturityTime
    //     );
    //     expect(updated.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
    //       oldNormalEndow.settingsController.earlyLockedWithdrawFee
    //     );
    //     expect(updated.settingsController.withdrawFee).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.withdrawFee
    //     );
    //     expect(updated.settingsController.depositFee).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.depositFee
    //     );
    //     expect(updated.settingsController.balanceFee).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.balanceFee
    //     );
    //     expect(updated.settingsController.name).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.name
    //     );
    //     expect(updated.settingsController.image).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.image
    //     );
    //     expect(updated.settingsController.logo).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.logo
    //     );
    //     expect(updated.settingsController.sdgs).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.sdgs
    //     );
    //     expect(updated.settingsController.splitToLiquid).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.splitToLiquid
    //     );
    //     expect(updated.settingsController.ignoreUserSplits).to.equalSettingsPermission(
    //       normalEndowReq.settingsController.ignoreUserSplits
    //     );
    //   });
    // });

    // describe("updateFeeSettings", () => {
    //   const defaultFee: LibAccounts.FeeSettingStruct = {
    //     bps: 2000,
    //     payoutAddress: genWallet().address,
    //   };
    //   const request: AccountMessages.UpdateFeeSettingRequestStruct = {
    //     id: normalEndowId,
    //     earlyLockedWithdrawFee: defaultFee,
    //     depositFee: defaultFee,
    //     withdrawFee: defaultFee,
    //     balanceFee: defaultFee,
    //   };

    //   it("reverts if updating charity fees", async () => {
    //     await expect(
    //       facet.connect(owner).updateFeeSettings({...request, id: charityId})
    //     ).to.be.revertedWith("Charity Endowments may not change endowment fees");
    //   });

    //   it("reverts if the endowment is closed", async () => {
    //     await state.setClosingEndowmentState(request.id, true, {
    //       enumData: 0,
    //       data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
    //     });
    //     await expect(facet.updateFeeSettings(request)).to.be.revertedWith("UpdatesAfterClosed");
    //   });

    //   it("changes nothing in endowment fees if fields cannot be changed", async () => {
    //     const lockedNormalEndow = await lockSettings(normalEndowId, oldNormalEndow);

    //     await expect(facet.updateFeeSettings(request))
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(request.id);

    //     const updated = await state.getEndowmentDetails(request.id);

    //     expect(updated.earlyLockedWithdrawFee).to.equalFee(lockedNormalEndow.earlyLockedWithdrawFee);
    //     expect(updated.withdrawFee).to.equalFee(lockedNormalEndow.withdrawFee);
    //     expect(updated.depositFee).to.equalFee(lockedNormalEndow.depositFee);
    //     expect(updated.balanceFee).to.equalFee(lockedNormalEndow.balanceFee);
    //   });

    //   it("updates all normal endowment's controllers", async () => {
    //     await expect(facet.updateFeeSettings(request))
    //       .to.emit(facet, "EndowmentUpdated")
    //       .withArgs(request.id);

    //     const updated = await state.getEndowmentDetails(request.id);

    //     expect(updated.earlyLockedWithdrawFee).to.equalFee(request.earlyLockedWithdrawFee);
    //     expect(updated.withdrawFee).to.equalFee(request.withdrawFee);
    //     expect(updated.depositFee).to.equalFee(request.depositFee);
    //     expect(updated.balanceFee).to.equalFee(request.balanceFee);
    //   });
  });
});
