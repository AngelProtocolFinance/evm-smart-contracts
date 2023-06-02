import {task, types} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;
      await deployAngelProtocol(verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
