import {task} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs: {verify: string}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";
      await deployAngelProtocol(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
