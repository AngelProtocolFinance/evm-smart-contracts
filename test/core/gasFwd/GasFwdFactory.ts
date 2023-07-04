import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {getSigners} from "utils";
import {
  GasFwd__factory, 
  GasFwd,
  ProxyContract__factory,
  DummyERC20,
  GasFwdFactory,
  GasFwdFactory__factory
} from "typechain-types";
import {
  deployDummyERC20
} from "test/utils"

describe("GasFwdFactory", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  async function deployGasFwdFactory(
    owner: SignerWithAddress, 
    admin: SignerWithAddress,
    impl?: string, 
    accounts?: SignerWithAddress
  ) : Promise<GasFwdFactory> {

    let implementation
    if(impl) {
      implementation = impl
    }
    else {
      let GasFwd = new GasFwd__factory(admin);
      let gasFwdImpl = await GasFwd.deploy();
      await gasFwdImpl.deployed();
      implementation =  gasFwdImpl.address
    }

    let GFF = new GasFwdFactory__factory(owner);
    let gff = await GFF.deploy(
      implementation, 
      admin.address, 
      accounts? accounts.address : owner.address
    );
    await gff.deployed();
    return gff;
  }

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer
    admin = proxyAdmin
    user = apTeam1
  })

  describe("upon deployement", async function () {
    it("reverts if the implementation address is invalid", async function () {
      await expect(deployGasFwdFactory(
        owner,
        admin,
        ethers.constants.AddressZero,
      )).to.be.reverted
    })
    it("successfully deploys", async function () {
      expect(await deployGasFwdFactory(
        owner,
        admin
      ))
    })
  })
  describe("upon create", async function () {
    let gff: GasFwdFactory
    beforeEach(async function () {
      gff = await deployGasFwdFactory(owner, admin);
    })
    it("deploys a new proxy of the GasFwd contract", async function () {
      expect(gff.address)
      expect(await gff.create()).to.emit(gff, "GasFwdCreated")
    })
  })
  describe("upon updateImplementation", async function () {
    let gff: GasFwdFactory
    beforeEach(async function () {
      gff = await deployGasFwdFactory(owner, admin);
    })
    it("reverts if called by a non-owner ", async function () {
      await expect(gff.connect(admin).updateImplementation(ethers.constants.AddressZero))
        .to.be.revertedWith("Ownable: caller is not the owner")
    })
    it("reverts if the new impl address is invalid", async function () {
      await expect(gff.updateImplementation(ethers.constants.AddressZero))
        .to.be.revertedWithCustomError(gff, "InvalidAddress")
    })
  })
})