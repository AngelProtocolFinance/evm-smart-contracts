import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig} from "../helpers";

type TaskArgs = {
  accountsDiamond?: string;
  apTeamMultisig?: string;
  applications?: string;
  registrar?: string;
  verify: boolean;
  yes: boolean;
};

task("deploy:CharityApplication", "Will deploy CharityApplication contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying CharityApplication..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;
      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const applications = taskArgs.applications || addresses.multiSig.applications.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const deployData = await deployCharityApplication(
        applications,
        accountsDiamond,
        addresses.tokens.seedAsset,
        hre
      );

      if (!deployData) {
        return;
      }

      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {charityProposal: deployData.charityApplication.address},
        hre
      );

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        await verify(hre, deployData.charityApplicationLib);
        await verify(hre, deployData.charityApplication);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
