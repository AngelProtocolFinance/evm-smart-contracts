import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;
      await deployAPTeamMultiSig(verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
