import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Router, Router__factory } from "../typechain-types"
import { Registrar, Registrar__factory, IRegistrar } from "../typechain-types"
import { DummyVault, DummyVault__factory } from "../typechain-types";
import { DummyGateway, DummyGateway__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("Router", function () {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let Router: Router__factory
  let Registrar: Registrar__factory

  async function deployRouterAsProxy(
    gatewayAddress: string = "0xe432150cce91c13a887f7D836923d5597adD8E31", 
    gasRecvAddress: string = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"): 
  Promise<{router: Router, registrar: Registrar}> {
    [owner, user] = await ethers.getSigners();
    const registrar = await deployRegistrarAsProxy()
    Router = await ethers.getContractFactory("Router") as Router__factory
    const router = await upgrades.deployProxy(Router, [
      gatewayAddress,
      gasRecvAddress,
      registrar.address
    ]) as Router
    await router.deployed()
    return {router, registrar} 
  }

  async function deployRegistrarAsProxy(): Promise<Registrar> {
    Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory
    const registrar = await upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed();
    return registrar
  }

  async function deployDummyVault(vaultType: number = 1): Promise<DummyVault> {
    let Vault = await ethers.getContractFactory("DummyVault") as DummyVault__factory
    const vault = await Vault.deploy(vaultType) // Liquid type by default
    await vault.deployed()
    return vault
  }

  async function deployDummyGateway(): Promise<DummyGateway> {
    let Gateway = await ethers.getContractFactory("DummyGateway") as DummyGateway__factory
    const gateway = await Gateway.deploy()
    await gateway.deployed()
    return gateway
  }

  describe("Deployment", function () {

    it("Should successfully deploy the contract as an upgradable proxy", async function () {  
      const {router, } = await deployRouterAsProxy();
      expect(router.address);
      expect(await upgrades.upgradeProxy(router.address, Router))
    });

    it("Should set the right owner", async function () {
      const {router, } = await deployRouterAsProxy();
      expect(await router.owner()).to.equal(owner.address);
    });

    it("Should not allow a non-owner to run an upgrade", async function () {
      const {router, } = await deployRouterAsProxy();
      const UserRouter = await ethers.getContractFactory("Router", user) as Router__factory
      await expect(upgrades.upgradeProxy(router.address, UserRouter)).to.be.reverted
    })

    it("Accepts and initializes the gateway and gas receiver as part of init", async function () {
      const gateway = "0x4F4495243837681061C4743b74B3eEdf548D56A5"
      const gasRecv = "0x2d5d7d31F671F86C782533cc367F14109a082712"
      const {router, } = await deployRouterAsProxy(gateway, gasRecv)
      expect(await router.gateway()).to.equal(gateway)
      expect(await router.gasReceiver()).to.equal(gasRecv)
    })
  })

  describe("Protected methods", function () {
    it("Does not allow a non-gateway address to call executeWithToken", async function () {
      const gateway = await deployDummyGateway()
      const {router, } = await deployRouterAsProxy(gateway.address)
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "Polygon", 
        owner.address, 
        ethers.utils.formatBytes32String("payload"),
        "USDC", 
        1))
        .to.be.reverted
    })

    it("Does not allow a non-gateway address to call execute", async function () {
      const gateway = await deployDummyGateway()
      const {router, } = await deployRouterAsProxy(gateway.address)
      await expect(router.execute(
        ethers.utils.formatBytes32String("true"),
        "Polygon", 
        owner.address, 
        ethers.utils.formatBytes32String("payload")))
        .to.be.reverted
    })
  })

  describe("Packs and unpacks vault action data", function () {
    let actionData = {
      strategyId: "0xffffffff",
      selector: "0x00000000",
      accountIds: [1],
      token: ethers.constants.AddressZero,
      lockAmt: 111,
      liqAmt: 222
    }

  })
  describe("Routes messages according to payload instructions", function () {
    let lockedVault: DummyVault
    let liquidVault: DummyVault
    let gateway: DummyGateway
    before(async function () {
      lockedVault = await deployDummyVault(0)
      liquidVault = await deployDummyVault(1)
    })

    it("correctly calls depost")


  })
  

})