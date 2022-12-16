import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Router, Router__factory } from "../typechain-types"
import { IRouter, VaultActionStructToArray, ArrayToVaultActionStruct } from "../utils/IRouterHelpers"
import { Registrar, Registrar__factory, IRegistrar } from "../typechain-types"
import { IVault } from "../typechain-types"
import { DummyVault, DummyVault__factory } from "../typechain-types"
import { DummyGateway, DummyGateway__factory } from "../typechain-types"
import { DummyERC20, DummyERC20__factory } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { token } from "../typechain-types/@openzeppelin/contracts"

describe("Router", function () {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let Router: Router__factory
  let Registrar: Registrar__factory
  let defaultApParams = {
    "protocolTaxRate" :2,
    "protocolTaxBasis" : 100,
    "protocolTaxCollector" : ethers.constants.AddressZero,
    "primaryChain" : "Polygon",
    "primaryChainRouter" : "",
    "routerAddr" : ethers.constants.AddressZero
  } as IRegistrar.AngelProtocolParamsStruct

  async function deployRouterAsProxy(
    gatewayAddress: string = "0xe432150cce91c13a887f7D836923d5597adD8E31", 
    gasRecvAddress: string = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    registrar?: Registrar): 
  Promise<Router> {
    [owner, user] = await ethers.getSigners();
    let apParams = defaultApParams
    apParams.primaryChainRouter = "0x000000000000000000000000000000000000dead" // Router errors for null addresses
    if (!registrar) {
      registrar = await deployRegistrarAsProxy()
    }
    await registrar.setAngelProtocolParams(apParams)
    Router = await ethers.getContractFactory("Router") as Router__factory
    const router = await upgrades.deployProxy(Router, [
      gatewayAddress,
      gasRecvAddress,
      registrar.address
    ]) as Router
    await router.deployed()
    return router 
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

  async function packActionData(actionData: IRouter.VaultActionDataStruct): Promise<string> {
    const TypeList = ["bytes4", "bytes4", "uint[]", "address", "uint", "uint"]
    return ethers.utils.defaultAbiCoder.encode(TypeList, VaultActionStructToArray(actionData))
  }

  async function unpackActionData(encodedActionData: string): Promise<IRouter.VaultActionDataStruct> {
    const TypeList = ["string", "string", "uint[]", "string", "uint", "uint"]
    let decoded = ethers.utils.defaultAbiCoder.decode(TypeList, encodedActionData)
    return ArrayToVaultActionStruct(decoded)
  }

  async function mint(token: DummyERC20, to: string, amt: number) {
      await token.mint(to, amt)
  }

  async function deployDummyERC20(
    recipients?: string[], 
    amounts?: number[]) {
      let Token = await ethers.getContractFactory("DummyERC20") as DummyERC20__factory
      const token = await Token.deploy()
      await token.deployed()
      if (recipients && amounts) {
        for( var i in recipients) {
          await mint(token, recipients[i], amounts[i])
        }
      }
      return token
    }

  describe("Deployment", function () {
    let router: Router
    beforeEach(async function () {
      router = await deployRouterAsProxy()
    })

    it("Should successfully deploy the contract as an upgradable proxy", async function () {  
      expect(router.address);
      expect(await upgrades.upgradeProxy(router.address, Router))
    });

    it("Should set the right owner", async function () {
      expect(await router.owner()).to.equal(owner.address);
    });

    it("Should not allow a non-owner to run an upgrade", async function () {
      const UserRouter = await ethers.getContractFactory("Router", user) as Router__factory
      await expect(upgrades.upgradeProxy(router.address, UserRouter)).to.be.reverted
    })

    it("Accepts and initializes the gateway and gas receiver as part of init", async function () {
      const gateway = "0x4F4495243837681061C4743b74B3eEdf548D56A5"
      const gasRecv = "0x2d5d7d31F671F86C782533cc367F14109a082712"
      router = await deployRouterAsProxy(gateway, gasRecv)
      expect(await router.gateway()).to.equal(gateway)
      expect(await router.gasReceiver()).to.equal(gasRecv)
    })
  })

  describe("Protected methods", function () {
    let router: Router
    let gateway: DummyGateway
    before(async function () {
      gateway = await deployDummyGateway() 
    })
    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address)
    })

    it("Does not allow a non-gateway address to call executeWithToken", async function () {
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "Polygon", 
        owner.address, 
        ethers.utils.formatBytes32String("payload"),
        "USDC", 
        1))
        .to.be.revertedWith("Unauthorized Call")
    })

    it("Does not allow a non-gateway address to call execute", async function () {
      await expect(router.execute(
        ethers.utils.formatBytes32String("true"),
        "Polygon", 
        owner.address, 
        ethers.utils.formatBytes32String("payload")))
        .to.be.revertedWith("Unauthorized Call")
    })
  })
  describe("Correctly reverts", function () {
    let lockedVault: DummyVault
    let liquidVault: DummyVault
    let registrar: Registrar
    let gateway: DummyGateway
    let token: DummyERC20
    let router: Router
    let actionData = {
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: 111,
      liqAmt: 222
    } as IRouter.VaultActionDataStruct

    before(async function () {
      lockedVault = await deployDummyVault(0)
      liquidVault = await deployDummyVault(1)
      liquidVault.interface.getSighash("deposit")
      gateway = await deployDummyGateway()
      token = await deployDummyERC20()
      registrar = await deployRegistrarAsProxy()
      actionData.token = token.address
    })

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, undefined ,registrar)
    })

    it("when the token isn't accepted", async function () {
      actionData.selector = liquidVault.interface.getSighash("deposit")
      let packedData = await packActionData(actionData)
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.be.revertedWith("Token not accepted")
    })

    it("when the token designation doesn't match", async function () {
      await gateway.setTestTokenAddress(token.address)
      await registrar.setTokenAccepted(token.address, true)
      await registrar.setTokenAccepted(ethers.constants.AddressZero, true)
      actionData.selector = liquidVault.interface.getSighash("deposit")
      let packedData = await packActionData(actionData)
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        "WRONG",
        333
      ))
      .to.be.revertedWith("Token designation does not match")
    })

    it("when the payload amt doesn't match the GMP amt", async function () {
      await gateway.setTestTokenAddress(token.address)
      await registrar.setTokenAccepted(token.address, true)
      actionData.selector = liquidVault.interface.getSighash("deposit")
      let packedData = await packActionData(actionData)
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        334
      ))
      .to.be.revertedWith("Amount mismatch")
    })

    it("when the strategy is not approved", async function () {
      await gateway.setTestTokenAddress(token.address)
      await registrar.setTokenAccepted(token.address, true)
      actionData.selector = liquidVault.interface.getSighash("deposit")
      let packedData = await packActionData(actionData)
      await expect(router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.be.revertedWith("Strategy not approved")
    })

  })

  describe("Routes messages according to payload instructions", function () {
    let lockedVault: DummyVault
    let liquidVault: DummyVault
    let registrar: Registrar
    let gateway: DummyGateway
    let token: DummyERC20
    let router: Router
    let actionData = {
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: 111,
      liqAmt: 222
    } as IRouter.VaultActionDataStruct

    before(async function () {
      lockedVault = await deployDummyVault(0)
      liquidVault = await deployDummyVault(1)
      liquidVault.interface.getSighash("deposit")
      gateway = await deployDummyGateway()
      token = await deployDummyERC20()
      await liquidVault.setDefaultToken(token.address)
      await lockedVault.setDefaultToken(token.address)
      registrar = await deployRegistrarAsProxy()
      await gateway.setTestTokenAddress(token.address)
      await registrar.setTokenAccepted(token.address, true)
      await registrar.setStrategyParams(
        actionData.strategyId,
        lockedVault.address,
        liquidVault.address,
        true
      )
      actionData.token = token.address
    })

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, undefined ,registrar)
    })

    it("correctly calls depost", async function () {
      actionData.selector = liquidVault.interface.getSighash("deposit")
      let packedData = await packActionData(actionData)
      expect(await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.emit(liquidVault, "DepositMade")
    })

    it("correctly calls redeem via execute", async function () {
      actionData.selector = liquidVault.interface.getSighash("redeem")
      let packedData = await packActionData(actionData)
      await token.mint(liquidVault.address,actionData.liqAmt)
      await token.mint(lockedVault.address,actionData.lockAmt)
      await liquidVault.setRouterAddress(router.address)
      await lockedVault.setRouterAddress(router.address)
      expect(await router.execute(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData
      ))
      .to.emit(liquidVault, "Redemption")
      .to.emit(lockedVault, "Redemption")
    })

    it("correctly calls redeem via execute with token", async function () {
      actionData.selector = liquidVault.interface.getSighash("redeem")
      let packedData = await packActionData(actionData)
      await token.mint(liquidVault.address,actionData.liqAmt)
      await token.mint(lockedVault.address,actionData.lockAmt)
      await liquidVault.setRouterAddress(router.address)
      await lockedVault.setRouterAddress(router.address)
      expect(await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.emit(liquidVault, "Redemption")
      .to.emit(lockedVault, "Redemption")
    })

    it("correctly calls redeemAll via execute", async function () {
      actionData.selector = liquidVault.interface.getSighash("redeemAll")
      let packedData = await packActionData(actionData)
      await token.mint(liquidVault.address,actionData.liqAmt)
      await token.mint(lockedVault.address,actionData.lockAmt)
      expect(await router.execute(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData
      ))
      .to.emit(liquidVault, "Redemption")
    })

    it("correctly calls redeemAll via execute with token", async function () {
      actionData.selector = liquidVault.interface.getSighash("redeemAll")
      let packedData = await packActionData(actionData)
      await token.mint(liquidVault.address,actionData.liqAmt)
      await token.mint(lockedVault.address,actionData.lockAmt)
      expect(await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.emit(liquidVault, "Redemption")
    })

    it("correctly calls harvest via execute", async function () {
      actionData.selector = liquidVault.interface.getSighash("harvest")
      let packedData = await packActionData(actionData)
      expect(await router.execute(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData
      ))
      .to.emit(liquidVault, "Harvest")
    })

    it("correctly calls harvest via execute with token", async function () {
      actionData.selector = liquidVault.interface.getSighash("harvest")
      let packedData = await packActionData(actionData)
      expect(await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        defaultApParams.primaryChain,
        defaultApParams.primaryChainRouter,
        packedData,
        token.symbol(),
        333
      ))
      .to.emit(liquidVault, "Harvest")
    })


  })
  

})