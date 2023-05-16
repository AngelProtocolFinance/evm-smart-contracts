import { task } from "hardhat/config"
import config from "config"
import { charityApplications } from "contracts/multisigs/charity_applications/scripts/deploy"
import addresses from "contract-address.json"

task(
    "Deploy:deployCharityApplications",
    "Will deploy CharityApplications contract"
)
    .addParam("verify", "Want to verify contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const charityApplicationsData: Parameters<typeof charityApplications>[0] = [
                config.CHARITY_APPLICATION_DATA.expiry,
                addresses.multiSig.ApplicationsMultiSigProxy,
                addresses.accounts.diamond,
                config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
                config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
                config.CHARITY_APPLICATION_DATA.gasAmount,
                config.CHARITY_APPLICATION_DATA.fundSeedAsset,
                config.CHARITY_APPLICATION_DATA.seedAsset,
                config.CHARITY_APPLICATION_DATA.seedAssetAmount,
            ];
            const isTrueSet = taskArgs.verify === "true";

            await charityApplications(charityApplicationsData, isTrueSet, hre);
        } catch (error) {
            console.log(error);
        }
    });
