import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;
      await deployAPTeamMultiSig(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
