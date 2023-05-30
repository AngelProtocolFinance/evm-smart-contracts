import {task} from "hardhat/config";
import {deployHaloImplementation} from "contracts/halo/scripts/deploy";
import {logger} from "utils";

task("Deploy:deployHaloImplementation", "Will deploy HaloImplementation contract")
  .addParam("verify", "Want to verify contract")
  .addParam("swaprouter", "swap Router address")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

      await deployHaloImplementation(taskArgs.swaprouter, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
