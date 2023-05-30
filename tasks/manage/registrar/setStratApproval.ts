import {task, types} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";
import {Registrar} from "typechain-types";
import {getAddresses, logger} from "utils";

task("manage:registrar:setStratApproval")
  .addParam(
    "strategySelector",
    "The 4-byte unique ID of the strategy, set by bytes4(keccack256('StrategyName'))",
    "",
    types.string
  )
  .addParam(
    "approvalState",
    "Whether the strategy is currently approved or not, enum of {NOT_APPROVED,APPROVED,WITHDRAW_ONLY,DEPRECATED}",
    0,
    types.int
  )
  .setAction(async function (taskArguments: TaskArguments, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const registrar = (await hre.ethers.getContractAt("Registrar", registrarAddress)) as Registrar;
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current strategy approval state");
    let currentStratParams = await registrar.getStrategyParamsById(taskArguments.strategySelector);
    if (currentStratParams.approvalState == taskArguments.approvalState) {
      logger.out("Strategy approval state already matches desired state");
      return;
    }

    logger.divider();
    logger.out("Setting strategy approval state to:");
    logger.pad(50, "New strategy approval state", taskArguments.approvalState);
    await registrar.setStrategyApprovalState(
      taskArguments.strategySelector,
      taskArguments.approvalState
    );
  });
