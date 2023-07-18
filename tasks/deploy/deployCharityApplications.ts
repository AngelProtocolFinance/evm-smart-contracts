import {deployCharityApplications} from "contracts/multisigs/scripts/deployCharityApplications";
import {task} from "hardhat/config";
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

task("deploy:CharityApplications", "Will deploy CharityApplication contract")
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
  .addFlag("yes", "Automatic yes to prompt.")
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

      const charityApplications = await deployCharityApplications(
        accountsDiamond,
        addresses.tokens.seedAsset,
        hre
      );

      if (!charityApplications) {
        return;
      }

      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {
          charityApplications: charityApplications.address,
          dafApprovedEndowments: [],
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, charityApplications);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
