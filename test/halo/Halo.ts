import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {BigNumber, Signer} from "ethers";
import hre from "hardhat";
import {Halo, Halo__factory} from "typechain-types";
import {getProxyAdminOwner, getSigners} from "utils";

describe("Halo", function () {
  const INITIALSUPPLY = BigNumber.from(10).pow(27); // 1 billion tokens with 18 decimals

  let deployer: Signer;
  let proxyAdmin: Signer;
  let user: Signer;

  let halo: Halo;

  before(async function () {
    const signers = await getSigners(hre);
    deployer = signers.deployer;
    user = signers.apTeam1;

    proxyAdmin = await getProxyAdminOwner(hre);

    const Halo = new Halo__factory(deployer);
    halo = await Halo.deploy();
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("upon Deployment", async function () {
    it("Sends the specified amount to the specified recipient", async function () {
      expect(await halo.balanceOf(await deployer.getAddress())).to.equal(INITIALSUPPLY);
    });
    it("Does not mint tokens for the deployer implicitly", async function () {
      expect(await halo.balanceOf(await user.getAddress())).to.equal(0);
    });
    it("Creates initial tokens only for the contract deployer", async function () {
      expect(await halo.totalSupply()).to.equal(INITIALSUPPLY);
    });
    it("Token holder can burn tokens", async function () {
      const burnAmount = BigNumber.from(100000);
      await expect(halo.burn(burnAmount))
        .to.emit(halo, "Transfer")
        .withArgs(await halo.signer.getAddress(), hre.ethers.constants.AddressZero, burnAmount);
      expect(await halo.totalSupply()).to.equal(INITIALSUPPLY.sub(burnAmount));
    });
  });
});
