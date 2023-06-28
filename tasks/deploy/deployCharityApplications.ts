import {deployCharityApplications} from "contracts/multisigs/scripts/deployCharityApplications";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig} from "../helpers";

type TaskArgs = {
  accountsDiamond?: string;
  apTeamMultisig?: string;
  charityApplications?: string;
  registrar?: string;
  skipVerify: boolean;
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
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying CharityApplications..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;
      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const deployData = await deployCharityApplications(
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
        {charityApplications: deployData.charityApplications.address},
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData.charityApplications);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
