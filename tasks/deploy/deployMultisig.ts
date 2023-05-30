import {task} from "hardhat/config";
import config from "config";
import {ApplicationsMultiSig, APTeamMultiSig} from "typechain-types";
import {deployMultisig} from "contracts/multisigs/scripts/deploy";
import {ContractFunctionParams, getSigners, logger} from "utils";

task("Deploy:deployMultisig", "Will deploy Multisig contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {apTeam1, apTeam2, apTeam3} = await getSigners(hre.ethers);
      const APTeamData: ContractFunctionParams<APTeamMultiSig["initialize"]> = [
        [apTeam1.address, apTeam2.address],
        config.AP_TEAM_MULTISIG_DATA.threshold,
        config.AP_TEAM_MULTISIG_DATA.requireExecution,
      ];
      const ApplicationData: ContractFunctionParams<ApplicationsMultiSig["initialize"]> = [
        [apTeam2.address, apTeam3.address],
        config.APPLICATION_MULTISIG_DATA.threshold,
        config.APPLICATION_MULTISIG_DATA.requireExecution,
      ];
      const isTrueSet = taskArgs.verify === "true";
      await deployMultisig(ApplicationData, APTeamData, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
