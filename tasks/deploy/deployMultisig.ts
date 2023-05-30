import {task} from "hardhat/config";
import config from "config";
import {ApplicationsMultiSig, APTeamMultiSig} from "typechain-types";
import {deployMultisig} from "contracts/multisigs/scripts/deploy";
import {logger} from "utils";

task("Deploy:deployMultisig", "Will deploy Multisig contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const Admins = config.AP_TEAM_MULTISIG_DATA.admins;
      const APTeamData: Parameters<APTeamMultiSig["initialize"]> = [
        Admins,
        config.AP_TEAM_MULTISIG_DATA.threshold,
        config.AP_TEAM_MULTISIG_DATA.requireExecution,
      ];
      const ApplicationData: Parameters<ApplicationsMultiSig["initialize"]> = [
        Admins,
        config.APPLICATION_MULTISIG_DATA.threshold,
        config.APPLICATION_MULTISIG_DATA.requireExecution,
      ];
      const isTrueSet = taskArgs.verify === "true";
      await deployMultisig(ApplicationData, APTeamData, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
