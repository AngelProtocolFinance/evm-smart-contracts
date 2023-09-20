import {task} from "hardhat/config";
import {
  APVault_V1__factory,
  DummyERC20__factory,
  IVault,
  IVaultEmitter__factory,
} from "typechain-types";
import {ChainID, VaultType} from "types";
import {deploy, getAddresses, getChainIdFromNetworkName, getSigners, logger, StratConfig, StrategyObject, validateAddress, verify} from "utils";
import {allStrategyConfigs} from "../../../contracts/integrations/stratConfig";

type TaskArgs = {
  name: string;
  baseToken?: string;
  yieldToken: string;
  admin?: string;
  skipVerify: boolean;
}

task("Deploy:strategy", "Will deploy a pair of generic vaults and the specified strategy")
  .addParam(
    "name", 
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`
  )
  .addOptionalParam("baseToken", "The address of the base token, default to usdc")
  .addParam("yieldtoken", "The address of the yield token")
  .addOptionalParam("admin", "The address of the admin, default is APTeamMultisig")
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out(`Deploying strategy: ${taskArgs.name}`);
      const config: StratConfig = allStrategyConfigs[taskArgs.name];

      let network = await hre.ethers.provider.getNetwork();
      if(network.chainId != getChainIdFromNetworkName(config.params.network)) {
        throw new Error(`Invalid hardhat network selected, must be ${config.params.network}`)
      }

      const {deployer} = await getSigners(hre);
      let addresses = await getAddresses(hre);

      let baseToken = taskArgs.baseToken? taskArgs.baseToken : addresses.tokens.usdc;
      if(!validateAddress(taskArgs.yieldToken, "yieldToken Address")) {
        throw new Error(`Invalid yieldToken address provided`)
      }

      const Strategy = getStrategyFactory(config.name); 
      // data setup
      const APVault_V1 = new APVault_V1__factory(deployer);
      const lockedVaultConfig: IVault.VaultConfigStruct = {
        vaultType: VaultType.LOCKED,
        strategyId: config.id,
        strategy: ,
        registrar: addresses.registrar.proxy,
        baseToken: baseTokenAddress,
        yieldToken: yieldTokenAddress,
        apTokenName: "TestVault",
        apTokenSymbol: "TV",
      };
      // deploy
      const deployment = await deploy(APVault_V1, [
        vaultConfig,
        addresses.vaultEmitter.proxy,
        await deployer.getAddress(),
      ]);

      logger.out("Emitting `VaultCreated` event...");
      const vaultEmitter = IVaultEmitter__factory.connect(addresses.vaultEmitter.proxy, deployer);
      const tx = await vaultEmitter.vaultCreated(deployment.contract.address, vaultConfig);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await verify(hre, deployment);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
