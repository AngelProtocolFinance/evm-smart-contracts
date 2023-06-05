import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

task("deploy:CharityApplications", "Will deploy CharityApplications contract")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployCharityApplication(
        addresses.multiSig.applications.proxy,
        addresses.accounts.diamond,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
