import {task} from "hardhat/config";
import {deployLibraries} from "scripts";
import {logger} from "utils";

task("Deploy:Libraries", "Will deploy Libraries").setAction(async (_, hre) => {
  try {
    await deployLibraries(hre);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  } finally {
    logger.out("Done.");
  }
});
