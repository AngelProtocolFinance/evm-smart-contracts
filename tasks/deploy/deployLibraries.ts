import {task} from "hardhat/config";
import {deployLibraries} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:Libraries", "Will deploy Libraries")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = taskArgs.verify && !isLocalNetwork(hre.network);
      await deployLibraries(verify_contracts, hre);
      // TODO: should also update all contracts that depend on the updated libraries
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
