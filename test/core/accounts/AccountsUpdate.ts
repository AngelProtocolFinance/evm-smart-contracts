import {expect} from "chai";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {TestFacetProxyContract, AccountsUpdate__factory, AccountsUpdate} from "typechain-types";

import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsCreateEndowment";

describe("AccountsUpdate", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let facet: AccountsUpdate;
  let proxy: TestFacetProxyContract;
  let newRegistrar: string;
  let maxGeneralCategoryId: number;
  let earlyLockedWithdrawFee: LibAccounts.FeeSettingStruct;

  before(async function () {
    [owner, proxyAdmin, user] = await ethers.getSigners();
    newRegistrar = user.address;
    maxGeneralCategoryId = 2;
    earlyLockedWithdrawFee = {
      bps: 2000,
      payoutAddress: owner.address,
    };
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdate__factory(owner);
    let facetImpl = await Facet.deploy();
    proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    facet = AccountsUpdate__factory.connect(proxy.address, owner);
  });

  describe("updateOwner", () => {
    it("should update the owner when called by the current owner", async () => {
      await facet.updateOwner(user.address);

      const {owner} = await proxy.getConfig();
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
      await facet.updateConfig(newRegistrar, maxGeneralCategoryId, earlyLockedWithdrawFee);

      const config = await proxy.getConfig();
      expect(config.registrarContract).to.equal(newRegistrar);
      expect(config.maxGeneralCategoryId).to.equal(maxGeneralCategoryId);
      expect(config.earlyLockedWithdrawFee.bps).to.equal(earlyLockedWithdrawFee.bps);
      expect(config.earlyLockedWithdrawFee.payoutAddress).to.equal(
        earlyLockedWithdrawFee.payoutAddress
      );
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
