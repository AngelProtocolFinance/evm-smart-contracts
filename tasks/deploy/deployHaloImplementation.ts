import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

// import {deployHaloImplementation} from "contracts/halo/scripts/deploy";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addParam("swaprouter", "swap Router address")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      // await deployHaloImplementation(taskArgs.swaprouter, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
