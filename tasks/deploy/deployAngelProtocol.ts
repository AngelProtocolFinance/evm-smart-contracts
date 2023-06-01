import {task} from "hardhat/config";
import {mainTask} from "scripts/deployTask";
import {logger} from "utils";

task("Deploy:deployAngelProtocol", "Will deploy CompleteAngel protocol")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";
      await mainTask(isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
