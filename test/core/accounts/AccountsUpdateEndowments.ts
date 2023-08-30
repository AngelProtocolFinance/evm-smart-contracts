import {smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumberish} from "ethers";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, wait} from "test/utils";
import {
  AccountsUpdateEndowments,
  AccountsUpdateEndowments__factory,
  DummyERC165CompatibleContract__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowments";
import {
  AccountStorage,
  LibAccounts,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {ControllerSettingOption, genWallet, getSigners} from "utils";
import {deployFacetAsProxy, updateAllSettings, updateSettings} from "./utils";

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

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdminSigner!;
    endowOwner = signers.deployer;
    delegate = signers.apTeam2;

    oldCharity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      dao: genWallet().address,
      owner: endowOwner.address,
      // maturityAllowlist: [genWallet().address],
      multisig: endowOwner.address,
    };
    oldNormalEndow = {
      ...oldCharity,
      endowType: 1,
    };
  });

  beforeEach(async () => {
    const Facet = new AccountsUpdateEndowments__factory(accOwner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    facet = AccountsUpdateEndowments__factory.connect(state.address, endowOwner);

    await wait(state.setEndowmentDetails(charityId, oldCharity));
    await wait(state.setEndowmentDetails(normalEndowId, oldNormalEndow));
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
      };
      normalEndowReq = {
        id: normalEndowId,
        owner: oldNormalEndow.dao,
        name: "normal",
        sdgs: [4, 3],
        logo: "logo2",
        image: "image2",
      };
    });

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(normalEndowId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      );
      await expect(facet.updateEndowmentDetails(normalEndowReq)).to.be.revertedWith(
        "UpdatesAfterClosed"
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

      it(`reverts if a normal endowment is updating its SDGs with an array containing invalid values: [${sdgs}]`, async () => {
        const invalidRequest: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
          ...normalEndowReq,
          sdgs,
        };
        await expect(facet.updateEndowmentDetails(invalidRequest)).to.be.revertedWith(
          "InvalidInputs"
        );
      });
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

    it("updates the normal endowment even when no SDGs are passed", async () => {
      const emptySdgsReq: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...normalEndowReq,
        sdgs: [],
      };
      await expect(facet.updateEndowmentDetails(emptySdgsReq)).to.not.be.reverted;

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.sdgs).to.have.same.members(emptySdgsReq.sdgs);
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
        const oldEndow = await updateAllSettings(charityReq.id, {locked: true}, state);

        // using delegate signer to avoid updating owner data
        // (which uses different logic from other fields)
        await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(charityReq.id);

        await expectNothingChanged(charityReq.id, oldEndow);
      });

      it("changes nothing in normal endowment settings if settings are locked", async () => {
        const oldEndow = await updateAllSettings(normalEndowReq.id, {locked: true}, state);

        // using delegate signer to avoid updating owner data
        // (which uses different logic from other fields)
        await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(normalEndowReq.id);

        await expectNothingChanged(normalEndowReq.id, oldEndow);
      });

      it("changes nothing in charity settings if delegation has expired", async () => {
        const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await updateAllSettings(
          charityReq.id,
          {
            delegate: {addr: delegate.address, expires: blockTimestamp - 1},
          },
          state
        );

        await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(charityReq.id);

        await expectNothingChanged(charityReq.id, oldCharity);
      });

      it("changes nothing in normal endowment settings if delegation has expired", async () => {
        const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await updateAllSettings(
          normalEndowReq.id,
          {
            delegate: {addr: delegate.address, expires: blockTimestamp - 1},
          },
          state
        );

        await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
          .to.emit(facet, "EndowmentUpdated")
          .withArgs(normalEndowReq.id);

        await expectNothingChanged(normalEndowReq.id, oldNormalEndow);
      });

      async function expectNothingChanged(
        endowId: BigNumberish,
        oldEndow: AccountStorage.EndowmentStruct
      ) {
        const updated = await state.getEndowmentDetails(endowId);

        expect(updated.image).to.equal(oldEndow.image);
        expect(updated.logo).to.equal(oldEndow.logo);
        expect(updated.name).to.equal(oldEndow.name);
        expect(updated.owner).to.equal(oldEndow.owner);
        expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(oldEndow.sdgs);
      }
    });

    it("updates all charity settings except those updateable only by owner", async () => {
      await updateAllSettings(
        charityReq.id,
        {delegate: {addr: delegate.address, expires: 0}},
        state
      );

      await expect(facet.connect(delegate).updateEndowmentDetails(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.image).to.equal(charityReq.image);
      expect(updated.logo).to.equal(charityReq.logo);
      expect(updated.name).to.equal(charityReq.name);
      expect(updated.owner).to.equal(oldCharity.owner);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(
        [...charityReq.sdgs].sort()
      );
    });

    it("updates all normal endowment settings except those updateable only by owner", async () => {
      await updateAllSettings(
        normalEndowReq.id,
        {delegate: {addr: delegate.address, expires: 0}},
        state
      );

      await expect(facet.connect(delegate).updateEndowmentDetails(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.image).to.equal(normalEndowReq.image);
      expect(updated.logo).to.equal(normalEndowReq.logo);
      expect(updated.name).to.equal(normalEndowReq.name);
      expect(updated.owner).to.equal(oldNormalEndow.owner);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.members(normalEndowReq.sdgs);
    });

    it("updates all charity settings", async () => {
      await expect(facet.updateEndowmentDetails(charityReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(charityReq.id);

      const updated = await state.getEndowmentDetails(charityReq.id);

      expect(updated.image).to.equal(charityReq.image);
      expect(updated.logo).to.equal(charityReq.logo);
      expect(updated.name).to.equal(charityReq.name);
      expect(updated.owner).to.equal(charityReq.owner);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.ordered.members(
        [...charityReq.sdgs].sort()
      );
    });

    it("updates all normal endowment settings", async () => {
      await expect(facet.updateEndowmentDetails(normalEndowReq))
        .to.emit(facet, "EndowmentUpdated")
        .withArgs(normalEndowReq.id);

      const updated = await state.getEndowmentDetails(normalEndowReq.id);

      expect(updated.image).to.equal(normalEndowReq.image);
      expect(updated.logo).to.equal(normalEndowReq.logo);
      expect(updated.name).to.equal(normalEndowReq.name);
      expect(updated.owner).to.equal(normalEndowReq.owner);
      expect(updated.sdgs.map((x) => x.toNumber())).to.have.same.members(normalEndowReq.sdgs);
    });

    it("ignores updates to charity owner when new owner is zero address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...charityReq,
        owner: ethers.constants.AddressZero,
      };

      await wait(facet.updateEndowmentDetails(request));

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to charity owner when new owner is neither DAO nor MultiSig address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...charityReq,
        owner: genWallet().address,
      };

      await wait(facet.updateEndowmentDetails(request));

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to normal endowment owner when new owner is zero address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...normalEndowReq,
        owner: ethers.constants.AddressZero,
      };

      await wait(facet.updateEndowmentDetails(request));

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });

    it("ignores updates to normal endowment owner when new owner is neither DAO nor MultiSig address", async () => {
      const request: AccountMessages.UpdateEndowmentDetailsRequestStruct = {
        ...normalEndowReq,
        owner: genWallet().address,
      };

      await wait(facet.updateEndowmentDetails(request));

      const updated = await state.getEndowmentDetails(request.id);

      expect(updated.owner).to.equal(oldCharity.owner);
    });
  });

  describe("updateDelegate", () => {
    const newDelegate = genWallet().address;
    const newDelegateExpiry = 200;

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(normalEndowId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      );
      await expect(
        facet.setDelegate(
          normalEndowId,
          ControllerSettingOption.AcceptedTokens,
          ethers.constants.AddressZero,
          0
        )
      ).to.be.revertedWith("UpdatesAfterClosed");
    });

    it("reverts if invalid setting option is used", async () => {
      const invalidSettingOption = 200;

      await expect(
        facet.revokeDelegate(normalEndowId, invalidSettingOption)
      ).to.be.revertedWithoutReason();

      await expect(
        facet.setDelegate(normalEndowId, invalidSettingOption, ethers.constants.AddressZero, 0)
      ).to.be.revertedWithoutReason();
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
      {setting: ControllerSettingOption.EarlyLockedWithdrawFee, field: "earlyLockedWithdrawFee"},
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
          await expect(facet.setDelegate(normalEndowId, setting, newDelegate, newDelegateExpiry))
            .to.emit(facet, "EndowmentUpdated")
            .withArgs(normalEndowId);

          const {settingsController} = await state.getEndowmentDetails(normalEndowId);
          expect(settingsController[field].delegate.addr).to.equal(newDelegate);
          expect(settingsController[field].delegate.expires).to.equal(newDelegateExpiry);
        });

        it(`revokes delegate`, async () => {
          await expect(facet.revokeDelegate(normalEndowId, setting))
            .to.emit(facet, "EndowmentUpdated")
            .withArgs(normalEndowId);

          const {settingsController} = await state.getEndowmentDetails(normalEndowId);
          expect(settingsController[field].delegate.addr).to.equal(ethers.constants.AddressZero);
          expect(settingsController[field].delegate.expires).to.equal(0);
        });

        describe("cases with missing permissions", () => {
          it("reverts if sender is neither an owner nor delegate", async () => {
            await expect(
              facet.connect(accOwner).revokeDelegate(normalEndowId, setting)
            ).to.be.revertedWith("Unauthorized");
          });

          it("reverts if settings are locked", async () => {
            await updateSettings(normalEndowId, field, {locked: true}, state);

            await expect(facet.revokeDelegate(normalEndowId, setting)).to.be.revertedWith(
              "Unauthorized"
            );
          });

          it("reverts if delegation has expired", async () => {
            const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
            await updateSettings(
              normalEndowId,
              field,
              {
                delegate: {
                  addr: delegate.address,
                  expires: blockTimestamp - 1,
                },
              },
              state
            );

            await expect(
              facet.connect(delegate).revokeDelegate(normalEndowId, setting)
            ).to.be.revertedWith("Unauthorized");
          });
        });
      });
    });
  });

  describe("updateAcceptedToken", () => {
    const tokenAddr = genWallet().address;
    const priceFeedAddr = genWallet().address;

    it("reverts if invalid token address is passed", async () => {
      await expect(
        facet.updateAcceptedToken(normalEndowId, ethers.constants.AddressZero, priceFeedAddr, true)
      ).to.be.revertedWith("Invalid token address passed");
    });

    it("reverts if invalid price feed address is passed", async () => {
      await expect(
        facet.updateAcceptedToken(normalEndowId, tokenAddr, ethers.constants.AddressZero, true)
      ).to.be.revertedWith("Invalid priceFeed address passed");
    });

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(normalEndowId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      );
      await expect(
        facet.updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("UpdatesAfterClosed");
    });

    it("reverts if sender is neither an owner nor delegate for accepted tokens settings", async () => {
      await expect(
        facet.connect(accOwner).updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if accepted tokens settings are locked", async () => {
      await updateSettings(
        normalEndowId,
        "acceptedTokens",
        {
          locked: true,
        },
        state
      );

      await expect(
        facet.updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if for accepted tokens settings delegation has expired", async () => {
      const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
      await updateSettings(
        normalEndowId,
        "acceptedTokens",
        {
          delegate: {
            addr: delegate.address,
            expires: blockTimestamp - 1,
          },
        },
        state
      );

      await expect(
        facet.connect(delegate).updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if the token is a member of the protocol-level accepted tokens list in the Registrar", async () => {
      const registrarFake = await deployFakeRegistrar();
      registrarFake.isTokenAccepted.returns(true);
      await expect(
        facet.updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("Cannot add tokens already in the Registrar AcceptedTokens list");
    });

    it("reverts if the price feed passed to the function does not support ERC-165", async () => {
      const registrarFake = await deployFakeRegistrar();
      registrarFake.isTokenAccepted.returns(false);
      await expect(
        facet.updateAcceptedToken(normalEndowId, tokenAddr, priceFeedAddr, true)
      ).to.be.revertedWith("Price Feed contract is not a valid ERC-165 interface");
    });

    [true, false].forEach((tokenStatus) => {
      it(`adds token's price feed and sets token's status as ${
        tokenStatus ? "" : "*not* "
      }accepted`, async () => {
        const registrarFake = await deployFakeRegistrar();
        registrarFake.isTokenAccepted.returns(false);

        const FakePriceFeed = new DummyERC165CompatibleContract__factory(proxyAdmin);
        const fakePriceFeed = await FakePriceFeed.deploy();
        await fakePriceFeed.deployed();

        await expect(
          facet.updateAcceptedToken(normalEndowId, tokenAddr, fakePriceFeed.address, tokenStatus)
        ).to.not.be.reverted;

        await expect(await state.getPriceFeed(normalEndowId, tokenAddr)).to.equal(
          fakePriceFeed.address
        );
        await expect(await state.getTokenAccepted(normalEndowId, tokenAddr)).to.equal(tokenStatus);
      });
    });

    async function deployFakeRegistrar() {
      const registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
        address: genWallet().address,
      });
      await wait(
        state.setConfig({
          networkName: "test",
          owner: accOwner.address,
          version: "1",
          registrarContract: registrarFake.address,
          nextAccountId: 1,
          reentrancyGuardLocked: false,
        })
      );
      return registrarFake;
    }
  });
});
