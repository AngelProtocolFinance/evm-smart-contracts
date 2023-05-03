import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { charityApplications } from "../../contracts/multisigs/charity_applications/scripts/deploy"
import addresses from "../../contract-address.json"

task(
    "Deploy:deployCharityApplications",
    "Will deploy CharityApplications contract"
)
    .addParam("verify", "Want to verify contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const charityApplicationsData: Parameters<typeof charityApplications>[0] = [
                envConfig.CHARITY_APPLICATION_DATA.expiry,
                addresses.multiSig.ApplicationsMultiSigProxy,
                addresses.accounts.diamond,
                envConfig.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
                envConfig.CHARITY_APPLICATION_DATA.newEndowGasMoney,
                envConfig.CHARITY_APPLICATION_DATA.gasAmount,
                envConfig.CHARITY_APPLICATION_DATA.fundSeedAsset,
                envConfig.CHARITY_APPLICATION_DATA.seedAsset,
                envConfig.CHARITY_APPLICATION_DATA.seedAssetAmount,
            ];
            const isTrueSet = taskArgs.verify === "true";

            await charityApplications(charityApplicationsData, isTrueSet, hre);
        } catch (error) {
            console.log(error);
        }
    });
