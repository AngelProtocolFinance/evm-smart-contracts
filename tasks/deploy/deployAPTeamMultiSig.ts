import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("Deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify === "true";
      await deployAPTeamMultiSig(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
