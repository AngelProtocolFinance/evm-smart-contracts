import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {accountsDiamond?: string; applications?: string; verify: boolean};

task("deploy:CharityApplications", "Will deploy CharityApplications contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "applications",
    "ApplicationsMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
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
    }
  });
