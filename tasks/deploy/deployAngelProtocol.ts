import {task} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {envConfig, logger} from "utils";

task("Deploy:AngelProtocol", "Will deploy complete Angel Protocol").setAction(async (_, hre) => {
  try {
    logger.out(envConfig.PROD_NETWORK_ID);
    // await deployAngelProtocol(hre);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  } finally {
    logger.out("Done.");
  }
});
