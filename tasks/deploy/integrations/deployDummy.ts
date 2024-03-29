import {allStrategyConfigs} from "contracts/integrations/stratConfig";
import {task} from "hardhat/config";
import {cliTypes} from "tasks/types";
import {
  APVault_V1__factory,
  DummyERC20__factory,
  GoerliDummy__factory,
  VaultEmitter__factory,
} from "typechain-types";
import {VaultType} from "types";
import {
  StratConfig,
  StrategyObject,
  getAddresses,
  getSigners,
  logger,
  writeStrategyAddresses,
} from "utils";

type TaskArgs = {
  stratConfig: StratConfig;
  admin: string;
  skipVerify: boolean;
};

task("Deploy:dummyIntegration", "Will deploy a set of vaults and a dummy strategy")
  .addParam(
    "stratConfig",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    undefined,
    cliTypes.stratConfig
  )
  .addOptionalParam(
    "admin",
    "The wallet address that will be set as the admin for the vaults and strategy contracts, default is APTeamMultisig"
  )
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Deploying a set of vaults and a dummy strategy...");

      const config: StratConfig = taskArgs.stratConfig;
      const {deployer} = await getSigners(hre);
      let network = await hre.ethers.provider.getNetwork();
      if (network.chainId != config.chainId) {
        throw new Error(
          `Deploying strategy to incorrect network. Expcted: ${config.chainId}, Actual: ${network.chainId}`
        );
      }

      let addresses = await getAddresses(hre);
      let admin = taskArgs.admin || addresses.multiSig.apTeam.proxy;
      let YieldToken = new DummyERC20__factory(deployer);
      let yieldToken = await YieldToken.deploy(0);

      let Strategy = new GoerliDummy__factory(deployer);
      let strategy = await Strategy.deploy({
        strategyId: config.id,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        admin: admin,
      });
      await strategy.deployed();
      logger.pad(30, "Strategy deployed to", strategy.address);

      let Vault = new APVault_V1__factory(deployer);

      let lockedConfig = {
        vaultType: VaultType.LOCKED,
        strategyId: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        apTokenName: "LockedTestVault",
        apTokenSymbol: "LockTV",
      };
      let lockVault = await Vault.deploy(lockedConfig, addresses.vaultEmitter.proxy, admin);
      logger.pad(30, "Locked Vault deployed to", lockVault.address);

      let liquidConfig = {
        vaultType: VaultType.LIQUID,
        strategyId: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        apTokenName: "LiquidTestVault",
        apTokenSymbol: "LiqTV",
      };
      let liqVault = await Vault.deploy(liquidConfig, addresses.vaultEmitter.proxy, admin);
      logger.pad(30, "Liquid Vault deployed to", liqVault.address);

      const emitter = VaultEmitter__factory.connect(addresses.vaultEmitter.proxy, deployer);

      await emitter.vaultCreated(lockVault.address, {
        vaultType: VaultType.LOCKED,
        strategyId: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        apTokenName: "LockedTestVault",
        apTokenSymbol: "LockTV",
      });
      await emitter.vaultCreated(liqVault.address, {
        vaultType: VaultType.LIQUID,
        strategyId: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: "0x2811747e3336aa28caf71c51454766e1b95f56e8",
        apTokenName: "LiquidTestVault",
        apTokenSymbol: "LiqTV",
      });

      const data: StrategyObject = {
        strategy: strategy.address,
        locked: lockVault.address,
        liquid: liqVault.address,
      };

      writeStrategyAddresses(taskArgs.stratConfig.name, data);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
