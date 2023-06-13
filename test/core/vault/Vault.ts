import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyERC20,
  DummyGasService,
  DummyGateway,
  IVault,
  APVault_V1,
  APVault_V1__factory,
  LocalRegistrar,
  Router,
  DummyStrategy,
  IStrategy,
} from "typechain-types";
import {
  deployDummyStrategy,
  deployDummyERC20,
  deployRegistrarAsProxy,
  StrategyApprovalState,
  DEFAULT_STRATEGY_SELECTOR,
  DEFAULT_VAULT_NAME,
  DEFAULT_VAULT_SYMBOL
} from "test/utils"

describe("Vault", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let collector: SignerWithAddress;

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

  describe("Upon deployment", function() {
    let vault: APVault_V1
    let token: DummyERC20
    before(async function() {
      [owner, user, collector] = await ethers.getSigners()
      token = await deployDummyERC20(owner)
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
      token = await deployDummyERC20(owner)
    })
    beforeEach(async function () {
      vault = await deployVault({admin: owner.address, baseToken: token.address, yieldToken: token.address})
    })
    it("should set the config as specified on deployment", async function () {
      let config = await vault.getVaultConfig()
      expect(config.vaultType).to.equal(0)
      expect(config.strategySelector).to.equal(DEFAULT_STRATEGY_SELECTOR)
      expect(config.strategy).to.equal(ethers.constants.AddressZero)
      expect(config.registrar).to.equal(ethers.constants.AddressZero)
      expect(config.baseToken).to.equal(token.address)
      expect(config.yieldToken).to.equal(token.address)
      expect(config.apTokenName).to.equal(DEFAULT_VAULT_NAME)
      expect(config.apTokenSymbol).to.equal(DEFAULT_VAULT_SYMBOL)
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
    let registrar: LocalRegistrar
    before(async function() {
      baseToken = await deployDummyERC20(owner)
      yieldToken = await deployDummyERC20(owner)
      strategy = await deployDummyStrategy(
        owner,
        {
          baseToken: baseToken.address, 
          yieldToken: yieldToken.address, 
          admin: owner.address
        })
      registrar = await deployRegistrarAsProxy(owner)
      await registrar.setVaultOperatorApproved(owner.address, true)
    })
    beforeEach(async function () {
      vault = await deployVault({
        vaultType: 1, // Liquid
        admin: owner.address, 
        baseToken: baseToken.address, 
        yieldToken: yieldToken.address,
        strategy: strategy.address,
        registrar: registrar.address
      })
    })

    it("reverts if the operator isn't approved as an operator, sibling vault, or approved router", async function () {
      await registrar.setVaultOperatorApproved(owner.address, false)
      await registrar.setStrategyParams(
        DEFAULT_STRATEGY_SELECTOR,
        user.address,
        vault.address,
        StrategyApprovalState.APPROVED
      )
      await registrar.setAngelProtocolParams(
        {
          routerAddr: user.address,
          refundAddr: collector.address
        })
      await (expect (vault.deposit(0,baseToken.address,1)))
        .to.be.revertedWithCustomError(vault, "OnlyApproved")
      await registrar.setVaultOperatorApproved(owner.address, true)
    })

    it("reverts if the strategy is paused", async function () {
      await strategy.pause()
      await expect(vault.deposit(0,baseToken.address,1))
        .to.be.revertedWithCustomError(vault, "OnlyNotPaused")
      await strategy.unpause()
    })

    it("reverts if the token provided isn't the base token", async function () {
      await expect(vault.deposit(0,yieldToken.address,1))
      .to.be.revertedWithCustomError(vault, "OnlyBaseToken")
    })

    it("reverts if the baseToken approval fails", async function () {
      await baseToken.setApproveAllowed(false)
      await baseToken.mint(vault.address, 1)
      await expect(vault.deposit(0, baseToken.address, 1))
        .to.be.revertedWithCustomError(vault, "ApproveFailed")
      await baseToken.setApproveAllowed(true)
    })

    it("successfully completes the deposit", async function () {
      await baseToken.mint(vault.address, 1)
      await yieldToken.mint(strategy.address, 1)
      await strategy.setDummyAmt(1)
      expect(await vault.deposit(0, baseToken.address, 1))
      expect(await yieldToken.balanceOf(vault.address)).to.equal(1)
      expect(await baseToken.balanceOf(strategy.address)).to.equal(1)
      expect(await vault.balanceOf(0)).to.equal(1)
      let principles = await vault.principleByAccountId(0)
      expect(principles.baseToken).to.equal(1)
    })
  })
  })
})