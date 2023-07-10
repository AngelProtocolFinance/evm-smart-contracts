import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {AccountsUpdate, AccountsUpdate__factory, TestFacetProxyContract} from "typechain-types";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsCreateEndowment";
import {getSigners} from "utils";

describe("AccountsUpdate", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let facet: AccountsUpdate;
  let state: TestFacetProxyContract;
  let newRegistrar: string;
  let maxGeneralCategoryId: number;
  let earlyLockedWithdrawFee: LibAccounts.FeeSettingStruct;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    user = signers.deployer;

    newRegistrar = signers.airdropOwner.address;
    maxGeneralCategoryId = 2;
    earlyLockedWithdrawFee = {
      bps: 2000,
      payoutAddress: owner.address,
    };
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdate__factory(owner);
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

    facet = AccountsUpdate__factory.connect(state.address, owner);
  });

  describe("updateOwner", () => {
    it("should update the owner when called by the current owner", async () => {
      expect(await facet.updateOwner(user.address))
        .to.emit(facet, "OwnerUpdated")
        .withArgs(user.address);

      const {owner} = await state.getConfig();

      expect(owner).to.equal(user.address);
    });

    it("should revert when called by a non-owner address", async () => {
      await expect(facet.connect(user).updateOwner(user.address)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("should revert when the new owner address is invalid", async () => {
      const invalidAddress = ethers.constants.AddressZero;

      await expect(facet.updateOwner(invalidAddress)).to.be.revertedWith(
        "Enter a valid owner address"
      );
    });
  });

  describe("updateConfig", () => {
    it("should update the config when called by the owner", async () => {
      expect(
        await facet.updateConfig(newRegistrar, maxGeneralCategoryId, earlyLockedWithdrawFee)
      ).to.emit(facet, "ConfigUpdated");

      const config = await state.getConfig();

      expect(config.registrarContract).to.equal(newRegistrar);
      expect(config.maxGeneralCategoryId).to.equal(maxGeneralCategoryId);
      expect(config.earlyLockedWithdrawFee).to.equalFee(earlyLockedWithdrawFee);
    });

    it("should revert when called by a non-owner address", async () => {
      await expect(
        facet.connect(user).updateConfig(newRegistrar, maxGeneralCategoryId, earlyLockedWithdrawFee)
      ).to.be.revertedWith("Unauthorized");
    });

    it("should revert when the registrar address is invalid", async () => {
      const invalidAddress = ethers.constants.AddressZero;

      await expect(
        facet.updateConfig(invalidAddress, maxGeneralCategoryId, earlyLockedWithdrawFee)
      ).to.be.revertedWith("invalid registrar address");
    });
  });
});
