import config from "config";
import {charityApplications} from "contracts/multisigs/charity_applications/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("deploy:CharityApplications", "Will deploy CharityApplications contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const charityApplicationsData: Parameters<typeof charityApplications>[0] = [
        config.CHARITY_APPLICATION_DATA.expiry,
        addresses.multiSig.applications.proxy,
        addresses.accounts.diamond,
        config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
        config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
        config.CHARITY_APPLICATION_DATA.gasAmount,
        config.CHARITY_APPLICATION_DATA.fundSeedAsset,
        config.CHARITY_APPLICATION_DATA.seedAsset,
        config.CHARITY_APPLICATION_DATA.seedAssetAmount,
      ];
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await charityApplications(charityApplicationsData, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
