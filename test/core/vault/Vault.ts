import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers} from "hardhat";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {StrategyApprovalState, getSigners} from "utils";
import {
  deployDummyStrategy,
  deployDummyERC20,
  deployLocalRegistrarAsProxy,
  DEFAULT_STRATEGY_SELECTOR,
  DEFAULT_VAULT_NAME,
  DEFAULT_VAULT_SYMBOL,
  DEFAULT_NETWORK,
  wait,
} from "test/utils";
import {
  APVault_V1,
  APVault_V1__factory,
  DummyERC20,
  DummyStrategy,
  IVault,
  LocalRegistrar,
} from "typechain-types";

describe("Vault", function () {
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let admin: SignerWithAddress;
  let collector: SignerWithAddress;

  async function deployVault({
    baseToken,
    yieldToken,
    admin,
    vaultType = 0,
    strategySelector = DEFAULT_STRATEGY_SELECTOR,
    strategy = ethers.constants.AddressZero,
    registrar = ethers.constants.AddressZero,
    apTokenName = "TestVault",
    apTokenSymbol = "TV",
  }: {
    baseToken: string;
    yieldToken: string;
    admin: string;
    vaultType?: number;
    strategySelector?: string;
    strategy?: string;
    registrar?: string;
    apTokenName?: string;
    apTokenSymbol?: string;
  }): Promise<APVault_V1> {
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
      admin: admin,
    };
    const vault = await Vault.deploy(vaultInitConfig);
    await vault.deployed();
    return vault;
  }

  before(async function () {
    const {deployer, proxyAdmin, apTeam1, apTeam2} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;
    collector = apTeam2;
  });

  describe("Upon deployment", function () {
    let vault: APVault_V1;
    let token: DummyERC20;
    before(async function () {
      token = await deployDummyERC20(owner);
    });
    beforeEach(async function () {
      vault = await deployVault({
        admin: owner.address,
        baseToken: token.address,
        yieldToken: token.address,
      });
    });
    it("Should successfully deploy the vault", async function () {
      expect(await vault.address);
    });
    it("Should initialize the ERC4626 vault", async function () {
      expect(await vault.symbol()).to.equal("TV");
      expect(await vault.name()).to.equal("TestVault");
      expect(await vault.decimals()).to.equal(await token.decimals());
    });
    it("Should revert if the provided tokens are invalid", async function () {
      await expect(
        deployVault({
          admin: owner.address,
          baseToken: ethers.constants.AddressZero,
          yieldToken: ethers.constants.AddressZero,
        })
      ).to.be.reverted;
    });
  });

  describe("Upon get and set config", async function () {
    let vault: APVault_V1;
    let token: DummyERC20;
    before(async function () {
      token = await deployDummyERC20(owner);
    });
    beforeEach(async function () {
      vault = await deployVault({
        admin: owner.address,
        baseToken: token.address,
        yieldToken: token.address,
      });
    });
    it("should set the config as specified on deployment", async function () {
      let config = await vault.getVaultConfig();
      expect(config.vaultType).to.equal(0);
      expect(config.strategySelector).to.equal(DEFAULT_STRATEGY_SELECTOR);
      expect(config.strategy).to.equal(ethers.constants.AddressZero);
      expect(config.registrar).to.equal(ethers.constants.AddressZero);
      expect(config.baseToken).to.equal(token.address);
      expect(config.yieldToken).to.equal(token.address);
      expect(config.apTokenName).to.equal(DEFAULT_VAULT_NAME);
      expect(config.apTokenSymbol).to.equal(DEFAULT_VAULT_SYMBOL);
      expect(config.admin).to.equal(owner.address);
    });
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
        admin: user.address,
      } as IVault.VaultConfigStruct;
      await vault.setVaultConfig(newConfig);
      let queriedConfig = await vault.getVaultConfig();
      expect(queriedConfig.vaultType).to.equal(newConfig.vaultType);
      expect(queriedConfig.strategySelector).to.equal(newConfig.strategySelector);
      expect(queriedConfig.strategy).to.equal(newConfig.strategy);
      expect(queriedConfig.registrar).to.equal(newConfig.registrar);
      expect(queriedConfig.baseToken).to.equal(newConfig.baseToken);
      expect(queriedConfig.yieldToken).to.equal(newConfig.yieldToken);
      expect(queriedConfig.apTokenName).to.equal(newConfig.apTokenName);
      expect(queriedConfig.apTokenSymbol).to.equal(newConfig.apTokenSymbol);
      expect(queriedConfig.admin).to.equal(newConfig.admin);
    });
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
        admin: user.address,
      } as IVault.VaultConfigStruct;
      await expect(vault.connect(user).setVaultConfig(newConfig)).to.be.revertedWithCustomError(
        vault,
        "OnlyAdmin"
      );
    });
  });

  describe("upon Deposit", async function () {
    let vault: APVault_V1;
    let baseToken: DummyERC20;
    let yieldToken: DummyERC20;
    let strategy: DummyStrategy;
    let registrar: LocalRegistrar;
    before(async function () {
      baseToken = await deployDummyERC20(owner);
      yieldToken = await deployDummyERC20(owner);
      strategy = await deployDummyStrategy(owner, {
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: owner.address,
      });
      registrar = await deployLocalRegistrarAsProxy(owner, admin);
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
    });
    beforeEach(async function () {
      vault = await deployVault({
        vaultType: 1, // Liquid
        admin: owner.address,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        strategy: strategy.address,
        registrar: registrar.address,
      });
    });

    it("reverts if the operator isn't approved as an operator, sibling vault, or approved router", async function () {
      await wait(registrar.setVaultOperatorApproved(owner.address, false));
      await wait(
        registrar.setStrategyParams(
          DEFAULT_STRATEGY_SELECTOR,
          DEFAULT_NETWORK,
          user.address,
          vault.address,
          StrategyApprovalState.APPROVED
        )
      );
      await wait(
        registrar.setAngelProtocolParams({
          routerAddr: user.address,
          refundAddr: collector.address,
        })
      );
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyApproved"
      );
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
    });

    it("reverts if the strategy is paused", async function () {
      await wait(strategy.pause());
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyNotPaused"
      );
      await wait(strategy.unpause());
    });

    it("reverts if the token provided isn't the base token", async function () {
      await expect(vault.deposit(0, yieldToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyBaseToken"
      );
    });

    it("reverts if the baseToken approval fails", async function () {
      await wait(baseToken.setApproveAllowed(false));
      await wait(baseToken.mint(vault.address, 1));
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "ApproveFailed"
      );
      await wait(baseToken.setApproveAllowed(true));
    });

    it("successfully completes the deposit", async function () {
      await wait(baseToken.mint(vault.address, 1));
      await wait(yieldToken.mint(strategy.address, 1));
      await wait(strategy.setDummyAmt(1));
      await expect(vault.deposit(0, baseToken.address, 1)).to.not.be.reverted;
      expect(await yieldToken.balanceOf(vault.address)).to.equal(1);
      expect(await baseToken.balanceOf(strategy.address)).to.equal(1);
      expect(await vault.balanceOf(0)).to.equal(1);
      let principles = await vault.principleByAccountId(0);
      expect(principles.baseToken).to.equal(1);
    });

    it("successfully adds to the position after subsequent deposits", async function () {
      await wait(baseToken.mint(vault.address, 10));
      await wait(yieldToken.mint(strategy.address, 10));
      await wait(strategy.setDummyAmt(5));
      expect(await vault.deposit(0, baseToken.address, 5));
      expect(await vault.deposit(0, baseToken.address, 5));
    });

    it("allows multiple accounts to deposit and tracks them separately", async function () {
      await wait(baseToken.mint(vault.address, 1000));
      await wait(yieldToken.mint(strategy.address, 1000));
      await wait(strategy.setDummyAmt(500));
      await vault.deposit(0, baseToken.address, 500); // Acct. 0 gets 1:1
      await wait(strategy.setDummyAmt(250)); // Acct. 1 gets 1:2
      await vault.deposit(1, baseToken.address, 500);
      let shares_0 = await vault.balanceOf(0);
      let shares_1 = await vault.balanceOf(1);
      expect(shares_0).to.equal(500);
      expect(shares_1).to.equal(250);
    });
  });

  describe("upon Redemption", async function () {
    let vault: APVault_V1;
    let baseToken: DummyERC20;
    let yieldToken: DummyERC20;
    let strategy: DummyStrategy;
    let registrar: LocalRegistrar;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    const PRECISION = BigNumber.from(10).pow(24);
    before(async function () {
      registrar = await deployLocalRegistrarAsProxy(owner, admin);
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
      await wait(registrar.setFeeSettingsByFeesType(0, TAX_RATE, collector.address)); // establish tax collector
    });
    beforeEach(async function () {
      baseToken = await deployDummyERC20(owner);
      yieldToken = await deployDummyERC20(owner);
      strategy = await deployDummyStrategy(owner, {
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: owner.address,
      });
      vault = await deployVault({
        vaultType: 0, // Locked
        admin: owner.address,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        strategy: strategy.address,
        registrar: registrar.address,
      });
      await wait(baseToken.mint(vault.address, DEPOSIT));
      await wait(yieldToken.mint(strategy.address, DEPOSIT * EX_RATE));
      await wait(strategy.setDummyAmt(DEPOSIT * EX_RATE));
      await vault.deposit(0, baseToken.address, DEPOSIT);
    });

    it("reverts if the strategy is paused", async function () {
      await wait(strategy.pause());
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.revertedWithCustomError(
        vault,
        "OnlyNotPaused"
      );
      await wait(strategy.unpause());
    });

    it("reverts if the caller isn't approved", async function () {
      await wait(registrar.setVaultOperatorApproved(owner.address, false));
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.revertedWithCustomError(
        vault,
        "OnlyApproved"
      );
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
    });

    it("reverts if the baseToken transfer fails", async function () {
      await wait(baseToken.setTransferAllowed(false));
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.revertedWithCustomError(
        vault,
        "TransferFailed"
      );
      await wait(baseToken.setTransferAllowed(true));
    });

    it("reverts if the baseToken approve fails", async function () {
      await wait(baseToken.setApproveAllowed(false));
      await wait(strategy.setDummyAmt(DEPOSIT / 2));
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.reverted;
      await wait(baseToken.setApproveAllowed(true));
    });

    it("does not tax if the position hasn't earned yield", async function () {
      let shares = await vault.balanceOf(0);
      await wait(strategy.setDummyAmt(DEPOSIT / 2)); // no yield
      let collectorBal = await baseToken.balanceOf(collector.address);
      await vault.redeem(0, shares.div(2)); // Redeem half the position
      let newCollectorBal = await baseToken.balanceOf(collector.address);
      expect(newCollectorBal).to.equal(collectorBal);
      expect(await baseToken.transferFrom(vault.address, owner.address, DEPOSIT / 2));
    });

    it("taxes if the position is in the black", async function () {
      let shares = await vault.balanceOf(0);
      await wait(strategy.setDummyAmt(DEPOSIT)); // 100% yield
      let collectorBal = await baseToken.balanceOf(collector.address);
      await vault.redeem(0, shares.div(2)); // Redeem half the position
      let newCollectorBal = await baseToken.balanceOf(collector.address);
      let YIELD = DEPOSIT / 2; // half the tokens are yield when position is 100% yield
      let expectedTax = (YIELD * TAX_RATE) / 10000;
      expect(newCollectorBal).to.equal(collectorBal.add(expectedTax));
      expect(await baseToken.transferFrom(vault.address, owner.address, DEPOSIT - expectedTax));
    });

    it("updates the principles accordingly", async function () {
      let shares = await vault.balanceOf(0);
      await wait(strategy.setDummyAmt(DEPOSIT)); // 100% yield
      await vault.redeem(0, shares.div(2)); // Redeem half the position
      let expectedPrinciple = DEPOSIT / 2;
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(expectedPrinciple);
      expect(principle.costBasis_withPrecision).to.equal(PRECISION.div(EX_RATE));
    });

    it("calls redeemAll if the redemption value is gt or equal to the position", async function () {
      let shares = await vault.balanceOf(0);
      await wait(strategy.setDummyAmt(DEPOSIT)); // 100% yield
      await vault.redeem(0, shares); // Redeem the whole position
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(0); // we zero out princ. on full redemption
      expect(principle.costBasis_withPrecision).to.equal(0);
    });
  });

  describe("upon Redeem All", async function () {
    let vault: APVault_V1;
    let baseToken: DummyERC20;
    let yieldToken: DummyERC20;
    let strategy: DummyStrategy;
    let registrar: LocalRegistrar;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    before(async function () {
      registrar = await deployLocalRegistrarAsProxy(owner, admin);
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
      await wait(registrar.setFeeSettingsByFeesType(0, TAX_RATE, collector.address)); // establish tax collector
    });
    beforeEach(async function () {
      baseToken = await deployDummyERC20(owner);
      yieldToken = await deployDummyERC20(owner);
      strategy = await deployDummyStrategy(owner, {
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: owner.address,
      });
      vault = await deployVault({
        vaultType: 0, // Locked
        admin: owner.address,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        strategy: strategy.address,
        registrar: registrar.address,
      });
      await wait(baseToken.mint(vault.address, DEPOSIT));
      await wait(yieldToken.mint(strategy.address, DEPOSIT * EX_RATE));
      await wait(strategy.setDummyAmt(DEPOSIT * EX_RATE));
      await vault.deposit(0, baseToken.address, DEPOSIT);
    });

    it("reverts if the strategy is paused", async function () {
      await wait(strategy.pause());
      await expect(vault.redeemAll(0)).to.be.revertedWithCustomError(vault, "OnlyNotPaused");
      await wait(strategy.unpause());
    });

    it("reverts if the caller isn't approved", async function () {
      await wait(registrar.setVaultOperatorApproved(owner.address, false));
      await expect(vault.redeemAll(0)).to.be.revertedWithCustomError(vault, "OnlyApproved");
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
    });

    it("does not tax if the position hasn't earned yield", async function () {
      await wait(strategy.setDummyAmt(DEPOSIT)); // no yield
      let collectorBal = await baseToken.balanceOf(collector.address);
      await vault.redeemAll(0);
      let newCollectorBal = await baseToken.balanceOf(collector.address);
      expect(newCollectorBal).to.equal(collectorBal);
      expect(await baseToken.transferFrom(vault.address, owner.address, DEPOSIT));
    });

    it("taxes if the position is in the black", async function () {
      await wait(strategy.setDummyAmt(DEPOSIT * 2)); // 100% yield
      await wait(baseToken.mint(strategy.address, DEPOSIT)); // add the yield to the strategy
      let collectorBal = await baseToken.balanceOf(collector.address);
      await vault.redeemAll(0); // Redeem half the position
      let newCollectorBal = await baseToken.balanceOf(collector.address);
      let YIELD = DEPOSIT; // half the tokens are yield when position is 100% yield
      let expectedTax = (YIELD * TAX_RATE) / 10000;
      expect(newCollectorBal).to.equal(collectorBal.add(expectedTax));
      expect(await baseToken.transferFrom(vault.address, owner.address, DEPOSIT * 2 - expectedTax));
    });

    it("updates the principles accordingly", async function () {
      await wait(strategy.setDummyAmt(DEPOSIT)); // 100% yield
      await vault.redeemAll(0); // Redeem half the position
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(0); // we zero out princ. on full redemption
      expect(principle.costBasis_withPrecision).to.equal(0);
    });
  });

  describe("upon Harvest", async function () {
    let baseToken: DummyERC20;
    let yieldToken: DummyERC20;
    let strategy: DummyStrategy;
    let registrar: LocalRegistrar;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    const PRECISION = BigNumber.from(10).pow(24);
    before(async function () {
      registrar = await deployLocalRegistrarAsProxy(owner, admin);
      await wait(registrar.setVaultOperatorApproved(owner.address, true));
      await wait(registrar.setFeeSettingsByFeesType(1, TAX_RATE, collector.address)); // harvest fee type, establish tax collector
    });

    describe("For liquid vaults", async function () {
      let vault: APVault_V1;
      beforeEach(async function () {
        baseToken = await deployDummyERC20(owner);
        yieldToken = await deployDummyERC20(owner);
        strategy = await deployDummyStrategy(owner, {
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          admin: owner.address,
        });
        vault = await deployVault({
          vaultType: 1, // Locked
          admin: owner.address,
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: strategy.address,
          registrar: registrar.address,
        });
        await wait(baseToken.mint(vault.address, DEPOSIT));
        await wait(yieldToken.mint(strategy.address, DEPOSIT * EX_RATE));
        await wait(strategy.setDummyAmt(DEPOSIT * EX_RATE));
        await vault.deposit(0, baseToken.address, DEPOSIT);
      });

      it("reverts if the strategy is paused", async function () {
        await wait(strategy.pause());
        await expect(vault.harvest([0])).to.be.revertedWithCustomError(vault, "OnlyNotPaused");
        await wait(strategy.unpause());
      });

      it("reverts if the caller isn't approved", async function () {
        await wait(registrar.setVaultOperatorApproved(owner.address, false));
        await expect(vault.harvest([0])).to.be.revertedWithCustomError(vault, "OnlyApproved");
        await wait(registrar.setVaultOperatorApproved(owner.address, true));
      });

      it("does not harvest if the position hasn't earned yield", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT));
        let collectorBal = await baseToken.balanceOf(collector.address);
        await expect(vault.harvest([0])).to.not.be.reverted;
        let newCollectorBal = await baseToken.balanceOf(collector.address);
        expect(newCollectorBal).to.equal(collectorBal);
      });

      it("reverts if the yieldToken approve to strategy fails", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT * 2)); // 100% yield
        await wait(yieldToken.setApproveAllowed(false));
        await expect(vault.harvest([0])).to.be.reverted;
        await wait(baseToken.setTransferAllowed(true));
      });

      it("reverts if the baseToken transfer fails", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT * 2)); // 100% yield
        await wait(baseToken.setTransferAllowed(false));
        await expect(vault.harvest([0])).to.be.revertedWithCustomError(vault, "TransferFailed");
        await wait(baseToken.setTransferAllowed(true));
      });

      // @todo this test is a bit circular. We aren't effectively testing whether the vault is asking
      // for the right number of yield tokens to cover the expected tax since we set it explicitly.
      // We need better hooks in the dummy strategy to at least emit events with the queries so we can test
      // what the vault is sending.
      it("appropriately harevests yield", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT * 2)); // 100% yield
        let expectedHarvestAmt = (DEPOSIT * TAX_RATE) / 10000; // DEPOSIT = position in yield, apply tax
        await wait(strategy.setDummyAmt(expectedHarvestAmt));
        await expect(vault.harvest([0])).to.not.be.reverted;
        let newCollectorBal = await baseToken.balanceOf(collector.address);
        expect(newCollectorBal).to.equal(expectedHarvestAmt);
      });
    });

    describe("For locked vaults", async function () {
      let liquidVault: APVault_V1;
      let lockedVault: APVault_V1;
      let liquidStrategy: DummyStrategy;
      const REBAL_RATE = 5000; // 5%
      const BASIS = 10000;
      beforeEach(async function () {
        baseToken = await deployDummyERC20(owner);
        yieldToken = await deployDummyERC20(owner);
        strategy = await deployDummyStrategy(owner, {
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          admin: owner.address,
        });
        // establish second strategy for liquid vault responses
        liquidStrategy = await deployDummyStrategy(owner, {
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          admin: owner.address,
        });
        liquidVault = await deployVault({
          vaultType: 1, // Locked
          admin: owner.address,
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: liquidStrategy.address,
          registrar: registrar.address,
        });
        lockedVault = await deployVault({
          vaultType: 0, // Locked
          admin: owner.address,
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: strategy.address,
          registrar: registrar.address,
        });
        await wait(baseToken.mint(lockedVault.address, DEPOSIT));
        await wait(yieldToken.mint(strategy.address, DEPOSIT * EX_RATE));
        await wait(yieldToken.mint(liquidStrategy.address, DEPOSIT * EX_RATE));
        await wait(strategy.setDummyAmt(DEPOSIT * EX_RATE));
        await wait(lockedVault.deposit(0, baseToken.address, DEPOSIT));
        await wait(
          registrar.setStrategyParams(
            DEFAULT_STRATEGY_SELECTOR,
            DEFAULT_NETWORK,
            lockedVault.address,
            liquidVault.address,
            StrategyApprovalState.APPROVED
          )
        );
        await wait(
          registrar.setRebalanceParams({
            rebalanceLiquidProfits: false,
            lockedRebalanceToLiquid: REBAL_RATE,
            interestDistribution: 0,
            lockedPrincipleToLiquid: false,
            principleDistribution: 0,
            basis: BASIS,
          })
        );
      });

      it("reverts if the baseToken transfer fails", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT * 2)); // 100% yield
        await wait(baseToken.setTransferAllowed(false));
        await expect(lockedVault.harvest([0])).to.be.revertedWithCustomError(
          lockedVault,
          "TransferFailed"
        );
        await wait(baseToken.setTransferAllowed(true));
      });

      it("appropriately harvests yield and rebalances to the liquid sibling vault", async function () {
        await wait(strategy.setDummyPreviewAmt(DEPOSIT * 2)); // 100% yield
        let expectedTaxAmt = (DEPOSIT * TAX_RATE) / BASIS; // DEPOSIT = position in yield, apply tax
        let expectedRebalAmt = (DEPOSIT * REBAL_RATE) / BASIS;
        await wait(strategy.setDummyAmt(expectedTaxAmt + expectedRebalAmt));
        await wait(liquidStrategy.setDummyAmt(expectedRebalAmt * 2));
        await expect(lockedVault.harvest([0])).to.not.be.reverted;
        let newCollectorBal = await baseToken.balanceOf(collector.address);
        expect(newCollectorBal).to.equal(expectedTaxAmt);
        let liquidPrinciple = await liquidVault.principleByAccountId(0);
        expect(liquidPrinciple.baseToken).to.equal(expectedRebalAmt);
      });
    });
  });
});
