import {task, types} from "hardhat/config";
import {deployLibraries} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:Libraries", "Will deploy Libraries")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;
      await deployLibraries(verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
