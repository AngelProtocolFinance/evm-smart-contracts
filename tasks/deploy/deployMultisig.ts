import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { ApplicationsMultiSig, APTeamMultiSig } from "../../typechain-types"
import { deployMultisig } from "../../contracts/multisigs/scripts/deploy"

task("Deploy:deployMultisig", "Will deploy Multisig contract")
    .addParam("verify", "Want to verify contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const Admins = envConfig.AP_TEAM_MULTISIG_DATA.admins
            const APTeamData: Parameters<APTeamMultiSig["initialize"]> = [
                Admins,
                envConfig.AP_TEAM_MULTISIG_DATA.threshold,
                envConfig.AP_TEAM_MULTISIG_DATA.requireExecution,
            ]
            const ApplicationData: Parameters<ApplicationsMultiSig["initialize"]> = [
                Admins,
                envConfig.APPLICATION_MULTISIG_DATA.threshold,
                envConfig.APPLICATION_MULTISIG_DATA.requireExecution,
            ]
            const isTrueSet = taskArgs.verify === "true"
            await deployMultisig(ApplicationData, APTeamData, isTrueSet, hre)
        } catch (error) {
            console.log(error)
        }
    })
