import {deployHaloImplementation} from "contracts/halo/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .addParam("swaprouter", "swap Router address")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployHaloImplementation(taskArgs.swaprouter, verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
