import {allStrategyConfigs} from "contracts/integrations/stratConfig";
import {subtask, task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {Registrar__factory} from "typechain-types";
import {ChainID} from "types";
import {StratConfig, getAPTeamOwner, getAddressesByNetworkId, isProdNetwork, logger} from "utils";

type TaskArgs = {
  stratConfig: StratConfig;
  modifyExisting: boolean;
  apTeamSignerPkey?: string;
};

task("manage:registrar:setStratParams")
  .addParam(
    "stratConfig",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    undefined,
    cliTypes.stratConfig
  )
  .addFlag("modifyExisting", "Whether to modify an existing strategy")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    if (await isProdNetwork(hre)) {
      await hre.run("manage:registrar:setStratParams:on-network", {
        ...taskArguments,
        chainId: ChainID.polygon,
      });
      await hre.run("manage:registrar:setStratParams:on-network", {
        ...taskArguments,
        chainId: taskArguments.stratConfig.chainId,
      });
    } else {
      await hre.run("manage:registrar:setStratParams:on-network", {
        ...taskArguments,
        chainId: ChainID.mumbai,
      });
      await hre.run("manage:registrar:setStratParams:on-network", {
        ...taskArguments,
        chainId: taskArguments.stratConfig.chainId,
      });
    }
  });

subtask(
  "manage:registrar:setStratParams:on-network",
  "Updates strat params on the network specified by the 'chainId' param"
)
  .addParam(
    "stratConfig",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    undefined,
    cliTypes.stratConfig
  )
  .addParam(
    "chainId",
    "Chain ID of the network on which to run the task",
    0,
    cliTypes.enums(ChainID, "ChainID")
  )
  .addFlag("modifyExisting", "Whether to modify an existing strategy")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs & {chainId: ChainID}, hre) {
    logger.divider();
    const targetNetwork = ChainID[taskArguments.chainId];
    logger.out(`Updating strat params on ${targetNetwork}`);
    await hre.changeNetwork(targetNetwork);
    logger.out(`Connecting to registrar on ${hre.network.name}...`);
    const addresses = getAddressesByNetworkId(taskArguments.chainId);
    const apTeamOwner = await getAPTeamOwner(hre, taskArguments.apTeamSignerPkey);

    const registrar = Registrar__factory.connect(addresses.registrar.proxy, apTeamOwner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current strategy params at specified selector");
    const config: StratConfig = taskArguments.stratConfig;
    let currentStratParams = await registrar.getStrategyParamsById(config.id);
    if (
      currentStratParams.liquidVaultAddr == hre.ethers.constants.AddressZero &&
      currentStratParams.lockedVaultAddr == hre.ethers.constants.AddressZero
    ) {
      logger.out("No strategy currently exists for this selector");
    } else {
      logger.out("A strategy has already been set at this selctor", logger.Level.Warn);
      logger.pad(50, "Current strategy state:", currentStratParams.approvalState);
      logger.pad(50, "Current network:", currentStratParams.network);
      logger.pad(50, "Current Locked vault address:", currentStratParams.lockedVaultAddr);
      logger.pad(50, "Current Liquid vault address:", currentStratParams.liquidVaultAddr);
      if (!taskArguments.modifyExisting) {
        logger.out("To modify this strategy, use the modifyExisting flag", logger.Level.Warn);
        return;
      }
    }

    logger.divider();
    logger.out("Setting strategy params to: ");
    logger.pad(50, "New strategy selector", config.id);
    logger.pad(50, "New approval state", config.params.approvalState);
    logger.pad(50, "New network", config.params.network);
    logger.pad(50, "New locked vault address", config.params.lockedVaultAddr);
    logger.pad(50, "New liquid vault address", config.params.liquidVaultAddr);
    const updateData = registrar.interface.encodeFunctionData("setStrategyParams", [
      config.id,
      config.params.network,
      config.params.lockedVaultAddr,
      config.params.liquidVaultAddr,
      config.params.approvalState,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
