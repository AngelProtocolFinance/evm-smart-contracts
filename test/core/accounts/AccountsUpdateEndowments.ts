import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumberish} from "ethers";
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
      dao: genWallet().address,
      owner: endowOwner.address,
      maturityAllowlist: [genWallet().address],
      multisig: endowOwner.address,
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
});
