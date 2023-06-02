import {task} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {logger} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol").setAction(async (_, hre) => {
  try {
    await deployAngelProtocol(hre);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  } finally {
    logger.out("Done.");
  }
});
