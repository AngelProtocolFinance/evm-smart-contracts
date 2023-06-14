import {task, types} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {confirmAction, isLocalNetwork, logger} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      await deployAngelProtocol(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
