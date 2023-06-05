import {task, types} from "hardhat/config";
import {deployLibraries} from "scripts";
import {logger, shouldVerify} from "utils";

task("deploy:Libraries", "Will deploy Libraries")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = shouldVerify(hre.network) && taskArgs.verify;
      await deployLibraries(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
