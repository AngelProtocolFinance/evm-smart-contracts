import {deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:ApplicationsMultiSig", "Will deploy ApplicationsMultiSig contract")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      const applicationsMultisig = await deployApplicationsMultiSig(verify_contracts, hre);

      await hre.run("manage:CharityApplication:updateConfig", {
        applicationsMultisig: applicationsMultisig.proxy.address,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
