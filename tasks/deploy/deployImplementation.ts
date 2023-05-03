import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { deployImplementation } from "../../contracts/normalized_endowment/scripts/deployImplementation"

task("Deploy:deployImplementation", "Will deploy Implementation")
    .addParam("verify", "Want to verify contract")
    .addParam("registraraddress", "Address of the Registrar contract")
    .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
    .addParam("accountaddress", "Address of the Account")
    .addParam("apteammultisigaddress", "Address of the APTeam multisig")
    .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
    .setAction(async (taskArgs, hre) => {
        try {
            var isTrueSet = taskArgs.verify === "true";
            const lockedWithdrawalData = [
                taskArgs.registraraddress,
                taskArgs.accountaddress,
                taskArgs.apteammultisigaddress,
                taskArgs.endowmentmultisigaddress,
            ];

            let donationMatchCharityData = {
                reserveToken: envConfig.DONATION_MATCH_CHARITY_DATA.reserveToken,
                uniswapFactory:
                    envConfig.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
                registrarContract: taskArgs.registraraddress,
                poolFee: envConfig.DONATION_MATCH_CHARITY_DATA.poolFee,
                usdcAddress: envConfig.DONATION_MATCH_CHARITY_DATA.usdcAddress,
            };

            await deployImplementation(
                taskArgs.angelcorestruct,
                lockedWithdrawalData,
                donationMatchCharityData,
                isTrueSet,
                hre
            );
        } catch (error) {
            console.log(error);
        }
    });
