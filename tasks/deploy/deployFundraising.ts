import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { deployFundraising } from "../../contracts/accessory/fundraising/scripts/deploy"

task("Deploy:deployFundraising", "Will deploy Fundraising contract")
    .addParam("verify", "Want to verify contract")
    .addParam("registraraddress", "Address of the Registrar contract")
    .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
    .setAction(async (taskArgs, hre) => {
        try {
            var isTrueSet = taskArgs.verify === "true";
            let FundraisingDataInput = {
                registrarContract: taskArgs.registraraddress,
                nextId: envConfig.FundraisingDataInput.nextId,
                campaignPeriodSeconds:
                    envConfig.FundraisingDataInput.campaignPeriodSeconds,
                taxRate: envConfig.FundraisingDataInput.taxRate,
                acceptedTokens: envConfig.FundraisingDataInput.acceptedTokens,
            };

            await deployFundraising(
                FundraisingDataInput,
                taskArgs.angelcorestruct,
                isTrueSet,
                hre
            );
        } catch (error) {
            console.log(error);
        }
    });
