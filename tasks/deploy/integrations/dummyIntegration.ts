import {task} from "hardhat/config";
import {APVault_V1__factory, GoerliDummy__factory, DummyERC20__factory} from "typechain-types";
import {
  logger,
  getSigners,
  getAddresses,
  StratConfig,
  writeStrategyAddresses,
  VaultType,
  StrategyObject,
} from "utils";
import {allStrategyConfigs} from "../../../contracts/integrations/stratConfig";

type TaskArgs = {
  name: string;
  admin: string;
  skipVerify: boolean;
};

task("Deploy:dummyIntegration", "Will deploy a set of vaults and a dummy strategy")
  .addParam(
    "name",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`
  )
  .addOptionalParam(
    "admin",
    "The wallet address that will be set as the admin for the vaults and strategy contracts, default is APTeamMultisig"
  )
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const config: StratConfig = allStrategyConfigs[taskArgs.name];
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
        strategySelector: config.id,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        admin: admin,
      });
      await strategy.deployed();
      logger.pad(30, "Strategy deployed to", strategy.address);

      let Vault = new APVault_V1__factory(deployer);

      let lockedConfig = {
        vaultType: VaultType.LOCKED,
        strategySelector: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        apTokenName: "LockedTestVault",
        apTokenSymbol: "LockTV",
        admin: admin,
      };
      let lockVault = await Vault.deploy(lockedConfig);
      logger.pad(30, "Locked Vault deployed to", lockVault.address);

      let liquidConfig = {
        vaultType: VaultType.LIQUID,
        strategySelector: config.id,
        strategy: strategy.address,
        registrar: addresses.registrar.proxy,
        baseToken: addresses.tokens.usdc,
        yieldToken: yieldToken.address,
        apTokenName: "LiquidTestVault",
        apTokenSymbol: "LiqTV",
        admin: admin,
      };
      let liqVault = await Vault.deploy(liquidConfig);
      logger.pad(30, "Liquid Vault deployed to", liqVault.address);

      const data: StrategyObject = {
        strategy: strategy.address,
        locked: lockVault.address,
        liquid: liqVault.address,
      };

      writeStrategyAddresses(taskArgs.name, data);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });