import {Signer} from "ethers";
import {expect} from "chai";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, wait} from "test/utils";
import {AccountsUpdate, AccountsUpdate__factory, TestFacetProxyContract} from "typechain-types";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {EndowmentType} from "types";
import {getProxyAdminOwner, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";
import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";

describe("AccountsUpdate", function () {
  const {ethers} = hre;

  let owner: Signer;
  let proxyAdmin: Signer;
  let user: Signer;

  let facet: AccountsUpdate;
  let state: TestFacetProxyContract;

  let newRegistrar: string;
  let endowment: AccountStorage.EndowmentStruct;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    user = signers.deployer;

    proxyAdmin = await getProxyAdminOwner(hre);

    newRegistrar = await signers.apTeam1.getAddress();
    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: await owner.getAddress()};

    let Facet = new AccountsUpdate__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await wait(state.setEndowmentDetails(1, endowment));
    await wait(state.setEndowmentDetails(2, endowment));
    await wait(state.setEndowmentDetails(3, {...endowment, endowType: EndowmentType.Ast}));

    await wait(
      state.setConfig({
        owner: await owner.getAddress(),
        version: "1",
        networkName: "Polygon",
        registrarContract: ethers.constants.AddressZero,
        nextAccountId: 4,
        reentrancyGuardLocked: false,
      })
    );

    facet = AccountsUpdate__factory.connect(state.address, owner);
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("updateOwner", () => {
    it("should update the owner when called by the current owner", async () => {
      await expect(facet.updateOwner(await user.getAddress()))
        .to.emit(facet, "OwnerUpdated")
        .withArgs(await user.getAddress());

      const {owner} = await state.getConfig();

      expect(owner).to.equal(await user.getAddress());
    });

    it("should revert when called by a non-owner address", async () => {
      await expect(facet.connect(user).updateOwner(await user.getAddress())).to.be.revertedWith(
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
      await expect(facet.updateConfig(newRegistrar)).to.emit(facet, "ConfigUpdated");

      const config = await state.getConfig();

      expect(config.registrarContract).to.equal(newRegistrar);
    });

    it("should revert when called by a non-owner address", async () => {
      await expect(facet.connect(user).updateConfig(newRegistrar)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("should revert when the registrar address is invalid", async () => {
      const invalidAddress = ethers.constants.AddressZero;

      await expect(facet.updateConfig(invalidAddress)).to.be.revertedWith(
        "invalid registrar address"
      );
    });
  });

  describe("updateDafApprovedEndowments", () => {
    it("reverts when owner is not the sender", async () => {
      await expect(facet.connect(user).updateDafApprovedEndowments([1], [2])).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("reverts when no add/remove endowments are passed", async () => {
      await expect(facet.updateDafApprovedEndowments([], [])).to.be.revertedWith(
        "Must pass at least one endowment to add/remove"
      );
    });

    it("reverts when sender attempts to add an AST-type Endowment", async () => {
      await expect(facet.updateDafApprovedEndowments([3], [])).to.be.revertedWith(
        "Cannot add AST Endowments"
      );
    });

    it("passes with valid input endowments and authorized sender", async () => {
      await expect(facet.updateDafApprovedEndowments([1], [2]))
        .to.emit(facet, "DafApprovedEndowmentsUpdated")
        .withArgs([1], [2]);
    });
  });
});
