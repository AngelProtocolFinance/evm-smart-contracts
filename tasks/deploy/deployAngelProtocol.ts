import {task, types} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {logger, shouldVerify} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = shouldVerify(hre.network) && taskArgs.verify;
      await deployAngelProtocol(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
