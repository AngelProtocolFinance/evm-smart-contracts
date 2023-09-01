import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {Halo, Halo__factory} from "typechain-types";
import {getProxyAdminOwner, getSigners} from "utils";

describe("Halo token", function () {
  let Halo: Halo__factory;

  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  describe("upon Deployment", async function () {
    let halo: Halo;
    let INITIALSUPPLY = BigNumber.from(10).pow(27); // 1 billion tokens with 18 decimals

    beforeEach(async function () {
      const signers = await getSigners(hre);
      deployer = signers.deployer;
      proxyAdmin = await getProxyAdminOwner(hre);
      user = signers.apTeam1;

      Halo = (await hre.ethers.getContractFactory("Halo", deployer)) as Halo__factory;
      halo = await Halo.deploy();
      await halo.deployed();
    });

    it("Sends the specified amount to the specified recipient", async function () {
      expect(await halo.balanceOf(deployer.address)).to.equal(INITIALSUPPLY);
    });
    it("Does not mint tokens for the deployer implicitly", async function () {
      expect(await halo.balanceOf(user.address)).to.equal(0);
    });
    it("Creates initial tokens only for the contract deployer", async function () {
      expect(await halo.totalSupply()).to.equal(INITIALSUPPLY);
    });
    it("Token holder can burn tokens", async function () {
      const burnAmount = BigNumber.from(100000);
      expect(await halo.burn(burnAmount)).to.emit(halo, "Burn");
      expect(await halo.totalSupply()).to.equal(INITIALSUPPLY.sub(burnAmount));
    });
  });
});
