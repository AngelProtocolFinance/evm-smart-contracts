import {ContractFactory} from "ethers";
import {Deployment, StrategyApprovalState} from "types";
import {
  deploy,
  getAddresses,
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

  let network = await hre.ethers.provider.getNetwork();
  if (network.chainId !== getChainIdFromNetworkName(config.params.network)) {
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

  // establish registrar config on primary chain and this chain
  await hre.run("manage:registrar:setStratParams", {
    stratConfig: {
      ...config,
      params: {
        approvalState: config.params.approvalState,
        network: config.params.network,
        lockedVaultAddr: Locked.contract.address,
        liquidVaultAddr: Liquid.contract.address,
      },
    },
    modifyExisting: true,
    apTeamSignerPkey: signerPkey,
  });

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
