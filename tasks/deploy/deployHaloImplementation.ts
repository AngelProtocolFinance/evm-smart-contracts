import {task} from "hardhat/config";
import {logger} from "utils";

// import {deployHaloImplementation} from "contracts/halo/scripts/deploy";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addParam("verify", "Want to verify contract")
  .addParam("swaprouter", "swap Router address")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

      // await deployHaloImplementation(taskArgs.swaprouter, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
