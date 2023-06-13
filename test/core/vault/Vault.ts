import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyERC20,
  DummyERC20__factory,
  DummyGasService,
  DummyGasService__factory,
  DummyGateway,
  DummyGateway__factory,
  IVault,
  APVault_V1,
  APVault_V1__factory,
  LocalRegistrar,
  LocalRegistrar__factory,
  Router,
  Router__factory,
  DummyStrategy,
  DummyStrategy__factory,
  IStrategy,
} from "typechain-types";
import {
  ArrayToVaultActionStruct,
  IVaultHelpers,
  StrategyApprovalState,
  VaultActionStructToArray,
  getSigners
} from "utils";
import {LocalRegistrarLib} from "../../../typechain-types/contracts/core/registrar/LocalRegistrar";
import { hrtime } from "process";

describe("Vault", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let collector: SignerWithAddress;

  let Router: Router__factory;
  let Registrar: LocalRegistrar__factory;

  async function deployRegistrarAsProxy(): Promise<LocalRegistrar> {
    Registrar = (await ethers.getContractFactory("LocalRegistrar")) as LocalRegistrar__factory;
    const registrar = (await upgrades.deployProxy(Registrar)) as LocalRegistrar;
    await registrar.deployed();
    return registrar;
  }

  async function deployRouterAsProxy(
    gatewayAddress: string = "0xe432150cce91c13a887f7D836923d5597adD8E31",
    gasRecvAddress: string = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    registrar?: LocalRegistrar
  ): Promise<Router> {
    let defaultApParams = {
      routerAddr: ethers.constants.AddressZero,
      refundAddr: ethers.constants.AddressZero,
    } as LocalRegistrarLib.AngelProtocolParamsStruct;

    [owner, user] = await ethers.getSigners();
    let apParams = defaultApParams;
    apParams.refundAddr = collector.address;
    if (!registrar) {
      registrar = await deployRegistrarAsProxy();
    }
    await registrar.setAngelProtocolParams(apParams);
    Router = (await ethers.getContractFactory("Router")) as Router__factory;
    const router = (await upgrades.deployProxy(Router, [
      "polygon",
      gatewayAddress,
      gasRecvAddress,
      registrar.address,
    ])) as Router;
    await router.deployed();
    return router;
  }

  async function deployDummyGateway(): Promise<DummyGateway> {
    let Gateway = (await ethers.getContractFactory("DummyGateway")) as DummyGateway__factory;
    const gateway = await Gateway.deploy();
    await gateway.deployed();
    return gateway;
  }

  async function deployDummyGasService(): Promise<DummyGasService> {
    let GasService = (await ethers.getContractFactory(
      "DummyGasService"
    )) as DummyGasService__factory;
    const gasService = await GasService.deploy();
    await gasService.deployed();
    return gasService;
  }

  async function deployDummyERC20(recipients?: string[], amounts?: number[]) {
    let Token = (await ethers.getContractFactory("DummyERC20")) as DummyERC20__factory;
    const token = await Token.deploy();
    await token.deployed();
    if (recipients && amounts) {
      for (var i in recipients) {
        await mint(token, recipients[i], amounts[i]);
      }
    }
    return token;
  }

  async function mint(token: DummyERC20, to: string, amt: number) {
    await token.mint(to, amt);
  }

  async function deployVault(
    {
      baseToken, 
      yieldToken,
      admin,
      vaultType = 0, 
      strategySelector = "0x12345678",
      strategy = ethers.constants.AddressZero,
      registrar = ethers.constants.AddressZero,
      apTokenName = "TestVault",
      apTokenSymbol = "TV"
    } : {
      baseToken: string, 
      yieldToken: string,
      admin: string,
      vaultType?: number, 
      strategySelector?: string,
      strategy?: string,
      registrar?: string,
      apTokenName?: string,
      apTokenSymbol?: string
    }
    ): Promise<APVault_V1> {
    let Vault = new APVault_V1__factory(owner);
    let vaultInitConfig: IVault.VaultConfigStruct = {
      vaultType: vaultType,
      strategySelector: strategySelector,
      strategy: strategy,
      registrar: registrar,
      baseToken: baseToken, 
      yieldToken: yieldToken,
      apTokenName: apTokenName,
      apTokenSymbol: apTokenSymbol,
      admin: admin
    }
    const vault = await Vault.deploy(vaultInitConfig);
    await vault.deployed();
    return vault;
  }

  async function deployDummyStrategy(
    {
      baseToken, 
      yieldToken,
      admin,
      strategySelector = "0x12345678",
      lockedVault = ethers.constants.AddressZero,
      liquidVault = ethers.constants.AddressZero,
    } : {
      baseToken : string, 
      yieldToken : string,
      admin : string,
      strategySelector? : string,
      lockedVault? : string,
      liquidVault? : string,
    }
    ): Promise<DummyStrategy> {
    let Strategy = new DummyStrategy__factory(owner);
    let stratInitConfig: IStrategy.StrategyConfigStruct = {
      baseToken: baseToken, 
      yieldToken: yieldToken,
      admin: admin,
      strategySelector: strategySelector,
      lockedVault: lockedVault,
      liquidVault: liquidVault,
    }
    const strategy = await Strategy.deploy(stratInitConfig);
    await strategy.deployed();
    return strategy;
  }

  describe("Upon deployment", function() {
    let vault: APVault_V1
    let token: DummyERC20
    before(async function() {
      [owner, user, collector] = await ethers.getSigners()
      token = await deployDummyERC20()
    })
    beforeEach(async function () {
      vault = await deployVault({admin: owner.address, baseToken: token.address, yieldToken: token.address})
    })
    it("Should successfully deploy the vault", async function () {
      expect(await vault.address)
    })
    it("Should initialize the ERC4626 vault", async function () {
      expect(await vault.symbol()).to.equal("TV")
      expect(await vault.name()).to.equal("TestVault")
      expect(await vault.decimals()).to.equal(await token.decimals())
    })
    it("Should revert if the provided tokens are invalid", async function () {
      await expect(deployVault({admin: owner.address, baseToken: ethers.constants.AddressZero, yieldToken: ethers.constants.AddressZero})).to.be.reverted
    })
  })

  describe("Upon get and set config", async function () {
    let vault: APVault_V1
    let token: DummyERC20
    before(async function() {
      token = await deployDummyERC20()
    })
    beforeEach(async function () {
      vault = await deployVault({admin: owner.address, baseToken: token.address, yieldToken: token.address})
    })
    it("should set the config as specified on deployment", async function () {
      let config = await vault.getVaultConfig()
      expect(config.vaultType).to.equal(0)
      expect(config.strategySelector).to.equal("0x12345678")
      expect(config.strategy).to.equal(ethers.constants.AddressZero)
      expect(config.registrar).to.equal(ethers.constants.AddressZero)
      expect(config.baseToken).to.equal(token.address)
      expect(config.yieldToken).to.equal(token.address)
      expect(config.apTokenName).to.equal("TestVault")
      expect(config.apTokenSymbol).to.equal("TV")
      expect(config.admin).to.equal(owner.address)
    })
    it("should accept new config values", async function () {
      let newConfig = {
        vaultType: 1,
        strategySelector: "0x87654321",
        strategy: user.address,
        registrar: user.address,
        baseToken: token.address,
        yieldToken: token.address,
        apTokenName: "NewName",
        apTokenSymbol: "NN",
        admin: user.address
      } as IVault.VaultConfigStruct
      await vault.setVaultConfig(newConfig)
      let queriedConfig = await vault.getVaultConfig()
      expect(queriedConfig.vaultType).to.equal(newConfig.vaultType)
      expect(queriedConfig.strategySelector).to.equal(newConfig.strategySelector)
      expect(queriedConfig.strategy).to.equal(newConfig.strategy)
      expect(queriedConfig.registrar).to.equal(newConfig.registrar)
      expect(queriedConfig.baseToken).to.equal(newConfig.baseToken)
      expect(queriedConfig.yieldToken).to.equal(newConfig.yieldToken)
      expect(queriedConfig.apTokenName).to.equal(newConfig.apTokenName)
      expect(queriedConfig.apTokenSymbol).to.equal(newConfig.apTokenSymbol)
      expect(queriedConfig.admin).to.equal(newConfig.admin)
    })
    it("should revert when a non-admin calls the set method", async function () {
      let newConfig = {
        vaultType: 1,
        strategySelector: "0x87654321",
        strategy: user.address,
        registrar: user.address,
        baseToken: token.address,
        yieldToken: token.address,
        apTokenName: "NewName",
        apTokenSymbol: "NN",
        admin: user.address
      } as IVault.VaultConfigStruct
      await expect(vault.connect(user).setVaultConfig(newConfig)).to.be.revertedWithCustomError(vault, "OnlyAdmin")
    })

  describe("upon Deposit", async function () {
    let vault: APVault_V1
    let baseToken: DummyERC20
    let yieldToken: DummyERC20
    let strategy: DummyStrategy
    before(async function() {
      baseToken = await deployDummyERC20()
      yieldToken = await deployDummyERC20()
      strategy = await deployDummyStrategy({
        baseToken: baseToken.address, 
        yieldToken: yieldToken.address, 
        admin: owner.address})
    })
    beforeEach(async function () {
      vault = await deployVault({
        admin: owner.address, 
        baseToken: baseToken.address, 
        yieldToken: yieldToken.address,
        strategy: strategy.address
      })
    })
  })
  })
})