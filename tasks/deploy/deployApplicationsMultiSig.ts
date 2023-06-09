import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";

task("deploy:ApplicationsMultiSig", "Will deploy ApplicationsMultiSig contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;
      await deployApplicationsMultiSig(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
