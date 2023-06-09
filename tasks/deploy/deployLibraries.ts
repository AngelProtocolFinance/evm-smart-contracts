import {task, types} from "hardhat/config";
import {deployLibraries} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:Libraries", "Will deploy Libraries")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
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
