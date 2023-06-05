import {deployHaloImplementation} from "contracts/halo/scripts/deploy";
import {task, types} from "hardhat/config";
import {logger, shouldVerify} from "utils";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .addParam("swaprouter", "swap Router address")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = shouldVerify(hre.network) && taskArgs.verify;

      await deployHaloImplementation(taskArgs.swaprouter, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
