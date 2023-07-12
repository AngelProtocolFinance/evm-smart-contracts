import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber, BigNumberish} from "ethers";
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
import {PromiseOrValue} from "typechain-types/common";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowments";
import {
  AccountStorage,
  LibAccounts,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";

enum ControllerSettingOption {
  AcceptedTokens,
  LockedInvestmentManagement,
  LiquidInvestmentManagement,
  AllowlistedBeneficiaries,
  AllowlistedContributors,
  MaturityAllowlist,
  EarlyLockedWithdrawFee,
  MaturityTime,
  WithdrawFee,
  DepositFee,
  BalanceFee,
  Name,
  Image,
  Logo,
  Sdgs,
  SplitToLiquid,
  IgnoreUserSplits,
}

enum DelegateAction {
  Set,
  Revoke,
}

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
  async function updateDelegate(
    endowId: PromiseOrValue<BigNumberish>,
    delegate: LibAccounts.DelegateStruct
  ) {
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
        delegate: {...delegate},
      };
      return controller;
    }, {} as LibAccounts.SettingsControllerStruct);

    await state.setEndowmentDetails(endowId, lockedEndow);
    return lockedEndow;
  }

  /**
   * Updates all endowment's settings' delegate in a way that has no side-effects
   * @param endowId ID of the endowment
   * @returns the updated endowment data with all settings locked
   */
  async function lockSettings(endowId: PromiseOrValue<BigNumberish>) {
    const oldEndow = await state.getEndowmentDetails(endowId);
    const lockedEndow: AccountStorage.EndowmentStruct = {...oldEndow};
    lockedEndow.settingsController = (
      Object.entries(lockedEndow.settingsController) as [
        keyof LibAccounts.SettingsControllerStruct,
        LibAccounts.SettingsPermissionStruct
      ][]
    ).reduce((controller, [key, curSetting]) => {
      controller[key] = {
        locked: true,
        delegate: {...curSetting.delegate},
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
      dao: genWallet().address,
      owner: endowOwner.address,
      maturityAllowlist: [genWallet().address],
      multisig: endowOwner.address,
    };
    oldNormalEndow = {
      ...oldCharity,
      endowType: 1,
    };

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });
  });

  beforeEach(async () => {
    const Facet = new AccountsUpdateEndowments__factory(accOwner);
    const facetImpl = await Facet.deploy();
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
    let charityReq: AccountMessages.UpdateEndowmentDetailsRequestStruct;
    let normalEndowReq: AccountMessages.UpdateEndowmentDetailsRequestStruct;

    before(() => {
      charityReq = {
        id: charityId,
        owner: oldCharity.dao,
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
      normalEndowReq = {
        id: normalEndowId,
        owner: oldNormalEndow.dao,
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
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(normalEndowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.updateEndowmentDetails(normalEndowReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
      );
    });

    [[], [0], [18], [0, 18], [0, 5], [5, 18]].forEach((sdgs) => {
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

    describe("cases with missing permissions", () => {
      it("changes nothing in charity settings if sender is neither an owner nor delegate", async () => {
        await expect(facet.connect(accOwner).updateEndowmentDetails(charityReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(charityReq.id);

        await expectNothingChanged(charityReq.id, oldCharity);
      });

      it("changes nothing in normal endowment settings if sender is neither an owner nor delegate", async () => {
        await expect(facet.connect(accOwner).updateEndowmentDetails(normalEndowReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(normalEndowReq.id);

        await expectNothingChanged(normalEndowReq.id, oldNormalEndow);
      });

      it("changes nothing in charity settings if settings are locked", async () => {
        const oldEndow = await lockSettings(charityReq.id);
        await updateDelegate(charityReq.id, {addr: delegate.address, expires: 0});

        // using delegate signer to avoid updating owner and rebalance data
        // (which uses different logic from other fields)
        await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(charityReq.id);

        await expectNothingChanged(charityReq.id, oldEndow);
      });

      it("changes nothing in normal endowment settings if settings are locked", async () => {
        const oldEndow = await lockSettings(normalEndowReq.id);
        await updateDelegate(normalEndowReq.id, {addr: delegate.address, expires: 0});

        // using delegate signer to avoid updating owner and rebalance data
        // (which uses different logic from other fields)
        await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(normalEndowReq.id);

        await expectNothingChanged(normalEndowReq.id, oldEndow);
      });

      it("changes nothing in charity settings if delegation has expired", async () => {
        const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await updateDelegate(charityReq.id, {addr: delegate.address, expires: blockTimestamp - 1});

        await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(charityReq.id);

        await expectNothingChanged(charityReq.id, oldCharity);
      });

      it("changes nothing in normal endowment settings if delegation has expired", async () => {
        const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await updateDelegate(normalEndowReq.id, {
          addr: delegate.address,
          expires: blockTimestamp - 1,
        });

        await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(normalEndowReq.id);

        await expectNothingChanged(normalEndowReq.id, oldNormalEndow);
      });

      async function expectNothingChanged(
        endowId: PromiseOrValue<BigNumberish>,
        oldEndow: AccountStorage.EndowmentStruct
      ) {
        const updated = await state.getEndowmentDetails(endowId);

        expect(updated.image).to.equal(oldEndow.image);
        expect(updated.logo).to.equal(oldEndow.logo);
        expect(updated.name).to.equal(oldEndow.name);
        expect(updated.owner).to.equal(oldEndow.owner);
        expect(updated.rebalance).to.equalRebalance(oldEndow.rebalance);
        expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(oldEndow.sdgs);
      }
    });

    it("updates all charity settings except those updateable only by owner", async () => {
      await updateDelegate(charityReq.id, {addr: delegate.address, expires: 0});

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
      await updateDelegate(normalEndowReq.id, {addr: delegate.address, expires: 0});

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

    it("updates all charity settings except rebalance", async () => {
      await expect(facet.updateEndowmentDetails(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.image).to.equal(charityReq.image);
      expect(updated.logo).to.equal(charityReq.logo);
      expect(updated.name).to.equal(charityReq.name);
      expect(updated.owner).to.equal(charityReq.owner);
      expect(updated.rebalance).to.equalRebalance(oldCharity.rebalance);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(
        [...charityReq.sdgs].sort()
      );
    });

    it("updates all normal endowment settings including rebalance", async () => {
      await expect(facet.updateEndowmentDetails(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.image).to.equal(normalEndowReq.image);
      expect(updated.logo).to.equal(normalEndowReq.logo);
      expect(updated.name).to.equal(normalEndowReq.name);
      expect(updated.owner).to.equal(normalEndowReq.owner);
      expect(updated.rebalance).to.equalRebalance(normalEndowReq.rebalance);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.members(normalEndowReq.sdgs);
    });

    it("ignores updates to charity owner when new owner is zero address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...charityReq,
        owner: ethers.constants.AddressZero,
      };

      await facet.updateEndowmentDetails(request);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to charity owner when new owner is neither DAO nor MultiSig address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...charityReq,
        owner: genWallet().address,
      };

      await facet.updateEndowmentDetails(request);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to normal endowment owner when new owner is zero address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...normalEndowReq,
        owner: ethers.constants.AddressZero,
      };

      await facet.updateEndowmentDetails(request);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to normal endowment owner when new owner is neither DAO nor MultiSig address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...normalEndowReq,
        owner: genWallet().address,
      };

      await facet.updateEndowmentDetails(request);

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });
  });

  describe("updateDelegate", () => {
    const newDelegate = genWallet().address;
    const newDelegateExpiry = 200;

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(normalEndowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.updateDelegate(
          normalEndowId,
          ControllerSettingOption.AcceptedTokens,
          DelegateAction.Set,
          ethers.constants.AddressZero,
          0
        )
      ).to.be.revertedWith("UpdatesAfterClosed");
    });

    it("reverts if neither DelegateAction.Set nor DelegateAction.Revoke action is used", async () => {
      const invalidAction = 2;

      await expect(
        facet.updateDelegate(
          normalEndowId,
          ControllerSettingOption.EarlyLockedWithdrawFee,
          invalidAction,
          ethers.constants.AddressZero,
          0
        )
      ).to.be.revertedWithoutReason();
    });

    it("reverts if EarlyLockedWithdrawFee setting option is used", async () => {
      await expect(
        facet.updateDelegate(
          normalEndowId,
          ControllerSettingOption.EarlyLockedWithdrawFee,
          DelegateAction.Set,
          ethers.constants.AddressZero,
          0
        )
      ).to.be.revertedWith("Invalid setting input");
    });

    const runs: {
      setting: ControllerSettingOption;
      field: keyof LibAccounts.SettingsControllerStruct;
    }[] = [
      {setting: ControllerSettingOption.AcceptedTokens, field: "acceptedTokens"},
      {
        setting: ControllerSettingOption.LockedInvestmentManagement,
        field: "lockedInvestmentManagement",
      },
      {
        setting: ControllerSettingOption.LiquidInvestmentManagement,
        field: "liquidInvestmentManagement",
      },
      {
        setting: ControllerSettingOption.AllowlistedBeneficiaries,
        field: "allowlistedBeneficiaries",
      },
      {
        setting: ControllerSettingOption.AllowlistedContributors,
        field: "allowlistedContributors",
      },
      {setting: ControllerSettingOption.MaturityAllowlist, field: "maturityAllowlist"},
      {setting: ControllerSettingOption.MaturityTime, field: "maturityTime"},
      {setting: ControllerSettingOption.WithdrawFee, field: "withdrawFee"},
      {setting: ControllerSettingOption.DepositFee, field: "depositFee"},
      {setting: ControllerSettingOption.BalanceFee, field: "balanceFee"},
      {setting: ControllerSettingOption.Name, field: "name"},
      {setting: ControllerSettingOption.Image, field: "image"},
      {setting: ControllerSettingOption.Logo, field: "logo"},
      {setting: ControllerSettingOption.Sdgs, field: "sdgs"},
      {setting: ControllerSettingOption.SplitToLiquid, field: "splitToLiquid"},
      {setting: ControllerSettingOption.IgnoreUserSplits, field: "ignoreUserSplits"},
    ];
    runs.forEach(({setting, field}) => {
      describe(`Updating delegate for setting option "${ControllerSettingOption[setting]}"`, () => {
        it(`sets a new the delegate`, async () => {
          await expect(
            facet.updateDelegate(
              normalEndowId,
              setting,
              DelegateAction.Set,
              newDelegate,
              newDelegateExpiry
            )
          )
            .to.emit(facet, "EndowmentUpdated")
            .withArgs(normalEndowId);

          const {settingsController} = await state.getEndowmentDetails(normalEndowId);

          expect(settingsController[field].delegate.addr).to.equal(newDelegate);
          expect(settingsController[field].delegate.expires).to.equal(newDelegateExpiry);
        });

        it(`revokes delegate`, async () => {
          await expect(
            facet.updateDelegate(
              normalEndowId,
              setting,
              DelegateAction.Revoke,
              newDelegate, // the value is ignored
              newDelegateExpiry // the value is ignored
            )
          )
            .to.emit(facet, "EndowmentUpdated")
            .withArgs(normalEndowId);

          const {settingsController} = await state.getEndowmentDetails(normalEndowId);

          expect(settingsController[field].delegate.addr).to.equal(ethers.constants.AddressZero);
          expect(settingsController[field].delegate.expires).to.equal(0);
        });

        describe("cases with missing permissions", () => {
          it("changes nothing if sender is neither an owner nor delegate", async () => {
            await expect(
              facet
                .connect(accOwner)
                .updateDelegate(
                  normalEndowId,
                  setting,
                  DelegateAction.Revoke,
                  newDelegate,
                  newDelegateExpiry
                )
            ).to.be.revertedWith("Unauthorized");
          });

          it("changes nothing if settings are locked", async () => {
            const oldEndow = await lockSettings(normalEndowId);
            await updateDelegate(normalEndowId, {addr: delegate.address, expires: 0});

            // using delegate signer to avoid updating owner and rebalance data
            // (which uses different logic from other fields)
            await expect(
              facet
                .connect(delegate)
                .updateDelegate(
                  normalEndowId,
                  setting,
                  DelegateAction.Revoke,
                  newDelegate,
                  newDelegateExpiry
                )
            ).to.be.revertedWith("Unauthorized");
          });

          it("changes nothing if delegation has expired", async () => {
            const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await updateDelegate(normalEndowId, {
              addr: delegate.address,
              expires: blockTimestamp - 1,
            });

            await expect(
              facet
                .connect(delegate)
                .updateDelegate(
                  normalEndowId,
                  setting,
                  DelegateAction.Revoke,
                  newDelegate,
                  newDelegateExpiry
                )
            ).to.be.revertedWith("Unauthorized");
          });
        });
      });
    });
  });
});
