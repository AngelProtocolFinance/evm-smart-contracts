import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {Halo, Halo__factory} from "typechain-types";
import {getProxyAdminOwner, getSigners} from "utils";

describe("Halo token", function () {
  let Halo: Halo__factory;

  let deployer: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  describe("upon Deployment", async function () {
    let halo: Halo;
    let INITIALSUPPLY = BigNumber.from(10).pow(27); // 1 billion tokens with 18 decimals

    beforeEach(async function () {
      const signers = await getSigners(hre);
      deployer = signers.deployer;
      user = signers.apTeam1;

      proxyAdmin = await getProxyAdminOwner(hre);

      Halo = new Halo__factory(proxyAdmin);
      halo = await Halo.deploy(user.address, INITIALSUPPLY);
      await halo.deployed();
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
