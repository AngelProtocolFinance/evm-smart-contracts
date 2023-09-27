import {ContractFactory} from "ethers";
import {Deployment} from "types";
import {
  deploy,
  getAddresses,
  getChainIdFromNetworkName,
  getSigners,
  logger,
  StratConfig,
  StrategyObject,
  validateAddress,
  verify,
  writeStrategyAddresses,
} from "utils";
import {allStrategyConfigs} from "../../../../contracts/integrations/stratConfig";
import {deployVaultPair} from "contracts/core/vault/scripts/deployVaultPair";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function deployStrategySet(
  strategyName: string,
  factory: ContractFactory,
  hre: HardhatRuntimeEnvironment
) {
  const config: StratConfig = allStrategyConfigs[strategyName];

  let network = await hre.ethers.provider.getNetwork();
  if (network.chainId != getChainIdFromNetworkName(config.params.network)) {
    throw new Error(`Invalid hardhat network selected, must be ${config.params.network}`);
  }

  const {deployer} = await getSigners(hre);
  let addresses = await getAddresses(hre);

  const Strategy = await deploy(factory, [
    {
      strategyId: config.id,
      baseToken: config.baseToken,
      yieldToken: config.yieldToken,
      admin: addresses.multiSig.apTeam.proxy,
    },
  ]);

  // data setup
  const {Locked, Liquid} = await deployVaultPair(
    deployer,
    addresses.multiSig.apTeam.proxy,
    {
      vaultType: 0,
      strategyId: config.id,
      strategy: Strategy.contract.address,
      registrar: addresses.registrar.proxy,
      baseToken: config.baseToken,
      yieldToken: config.yieldToken,
      apTokenName: config.tokenName,
      apTokenSymbol: config.tokenSymbol,
    },
    hre
  );

  // Store addresses
  writeStrategyAddresses(strategyName, {
    locked: Locked.contract.address,
    liquid: Liquid.contract.address,
    strategy: Strategy.contract.address,
  });

  // Verify
  const deployments: Deployment<ContractFactory>[] = [Locked, Liquid, Strategy];
  for (const deployment of deployments) {
    await verify(hre, deployment);
  }
}
