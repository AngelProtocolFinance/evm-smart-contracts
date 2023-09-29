import {ContractFactory} from "ethers";
import {Deployment, StrategyApprovalState} from "types";
import {
  deploy,
  getAddresses,
  getChainId,
  getChainIdFromNetworkName,
  getSigners,
  StratConfig,
  verify,
  writeStrategyAddresses,
} from "utils";
import {allStrategyConfigs} from "../../../../contracts/integrations/stratConfig";
import {deployVaultPair} from "contracts/core/vault/scripts/deployVaultPair";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function deployStrategySet(
  strategyName: string,
  factory: ContractFactory,
  signerPkey: string,
  hre: HardhatRuntimeEnvironment
) {
  const config: StratConfig = allStrategyConfigs[strategyName];

  let chainId = await getChainId(hre);
  if (chainId !== getChainIdFromNetworkName(config.params.network)) {
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

  // Store addresses - do this before updating registrar so that lookup is complete
  writeStrategyAddresses(strategyName, {
    locked: Locked.contract.address,
    liquid: Liquid.contract.address,
    strategy: Strategy.contract.address,
  });

  // establish registrar config on primary chain and this chain
  await hre.run("manage:registrar:setStratParams", {
    stratName: strategyName,
    modifyExisting: true,
    apTeamSignerPkey: signerPkey,
  });

  // Verify
  const deployments: Deployment<ContractFactory>[] = [Locked, Liquid, Strategy];
  for (const deployment of deployments) {
    await verify(hre, deployment);
  }
}
