import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";
import {getAddresses} from "utils";
import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";

type TaskArgs = {accountsDiamond?: string; applications?: string; verify: boolean};

task("deploy:CharityApplications", "Will deploy CharityApplications contract")
  .addOptionalParam(
    "accountsDiamond",
    "Address of the Accounts Diamond contract. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "applications",
    "Address of the ApplicationsMultiSig contract. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const applications = taskArgs.applications || addresses.multiSig.applications.proxy;
      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      await deployCharityApplication(applications, accountsDiamond, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
