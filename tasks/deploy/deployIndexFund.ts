import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { deployIndexFund } from "../../contracts/core/index-fund/scripts/deploy"

task("Deploy:deployIndexFund", "Will deploy IndexFund contract")
    .addParam("verify", "Want to verify contract")
    .addParam("registraraddress", "Address of the Registrar contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const indexFundData = {
                registrarContract: taskArgs.registraraddress,
                fundRotation: envConfig.INDEX_FUND_DATA.fundRotation,
                fundMemberLimit: envConfig.INDEX_FUND_DATA.fundMemberLimit,
                fundingGoal: envConfig.INDEX_FUND_DATA.fundingGoal,
            };
            var isTrueSet = taskArgs.verify === "true";

            await deployIndexFund(indexFundData, isTrueSet, hre);
        } catch (error) {
            console.log(error);
        }
    });
