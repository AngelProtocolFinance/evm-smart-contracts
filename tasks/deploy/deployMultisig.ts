import {task} from "hardhat/config";
import config from "config";
import {ApplicationsMultiSig, APTeamMultiSig} from "typechain-types";
import {deployMultisig} from "contracts/multisigs/scripts/deploy";
import {ContractFunctionParams, getSigners, logger} from "utils";

task("Deploy:Multisig", "Will deploy Multisig contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {apTeamMultisigOwners, applicationsMultisigOwners} = await getSigners(hre.ethers);
      const APTeamData: ContractFunctionParams<APTeamMultiSig["initialize"]> = [
        apTeamMultisigOwners.map((x) => x.address),
        config.AP_TEAM_MULTISIG_DATA.threshold,
        config.AP_TEAM_MULTISIG_DATA.requireExecution,
      ];
      const ApplicationData: ContractFunctionParams<ApplicationsMultiSig["initialize"]> = [
        applicationsMultisigOwners.map((x) => x.address),
        config.APPLICATION_MULTISIG_DATA.threshold,
        config.APPLICATION_MULTISIG_DATA.requireExecution,
      ];
      const isTrueSet = taskArgs.verify === "true";
      await deployMultisig(ApplicationData, APTeamData, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
