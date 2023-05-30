import {task, types} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";
import {Registrar} from "typechain-types";
import {getAddresses, logger} from "utils";

task("manage:registrar:setStratParams")
  .addParam(
    "strategySelector",
    "The 4-byte unique ID of the strategy, set by bytes4(keccack256('StrategyName'))",
    "",
    types.string
  )
  .addParam(
    "approvalState",
    "Whether the strategy is currently approved or not, enum of NOT_APPROVED, APPROVED, WITHDRAW_ONLY, or DEPRECATED",
    0,
    types.int
  )
  .addParam("lockedVaultAddress", "The address of the strategys locked vault", "", types.string)
  .addParam("liquidVaultAddress", "The address of the strategys liquid vault", "", types.string)
  .addOptionalParam(
    "modifyExisting",
    "Whether to modify an existing strategy",
    false,
    types.boolean
  )
  .setAction(async function (taskArguments: TaskArguments, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const registrar = (await hre.ethers.getContractAt("Registrar", registrarAddress)) as Registrar;
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current strategy params at specified selector");
    let currentStratParams = await registrar.getStrategyParamsById(taskArguments.strategySelector);
    if (
      currentStratParams.Liquid.vaultAddr == hre.ethers.constants.AddressZero &&
      currentStratParams.Locked.vaultAddr == hre.ethers.constants.AddressZero
    ) {
      logger.out("No strategy currently exists for this selector");
    } else {
      logger.out("A strategy has already been set at this selctor", logger.Level.Warn);
      logger.pad(50, "Current strategy state:", currentStratParams.approvalState);
      logger.pad(50, "Current Locked vault address:", currentStratParams.Locked.vaultAddr);
      logger.pad(50, "Current Liquid vault address:", currentStratParams.Liquid.vaultAddr);
      if (!taskArguments.modifyExisting) {
        logger.out("To modify this strategy, use the modifyExisting flag", logger.Level.Warn);
        return;
      }
    }

    logger.divider();
    logger.out("Setting strategy params to: ");
    logger.pad(50, "New strategy selector", taskArguments.strategySelector);
    logger.pad(50, "New approval state", taskArguments.approvalState);
    logger.pad(50, "New locked vault address", taskArguments.lockedVaultAddress);
    logger.pad(50, "New liquid vault address", taskArguments.liquidVaultAddress);
    await registrar.setStrategyParams(
      taskArguments.strategySelector,
      taskArguments.lockedVaultAddress,
      taskArguments.liquidVaultAddress,
      taskArguments.approvalState
    );
  });
