import {task, types} from "hardhat/config";
import {deployAngelProtocol} from "scripts";
import {isLocalNetwork, logger} from "utils";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      await deployAngelProtocol(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
