import {task} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {logger} from "utils";

task("Deploy:deployAngelProtocol", "Will deploy CompleteAngel protocol").setAction(
  async (_, hre) => {
    try {
      await deployAngelProtocol(hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  }
);
