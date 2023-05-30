import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Halo, Halo__factory} from "typechain-types";
import {BigNumber} from "ethers";

describe("Halo token", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let Halo: Halo__factory;

  describe("upon Deployment", async function () {
    let halo: Halo;
    let INITIALSUPPLY = BigNumber.from(10).pow(27); // 1 billion tokens with 18 decimals
    beforeEach(async function () {
      [deployer, user] = await ethers.getSigners();
      Halo = (await ethers.getContractFactory("Halo")) as Halo__factory;
      halo = await Halo.deploy(user.address, INITIALSUPPLY);
    });

    it("Sends the specified amount to the specified recipient", async function () {
      expect(await halo.balanceOf(user.address)).to.equal(INITIALSUPPLY);
    });
    it("Does not mint tokens for the deployer implicitly", async function () {
      expect(await halo.balanceOf(deployer.address)).to.equal(0);
    });
    it("creates tokens only for the recipient", async function () {
      expect(await halo.totalSupply()).to.equal(INITIALSUPPLY);
    });
  });
});
