import {deployCharityApplications} from "contracts/multisigs/scripts/deployCharityApplications";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  accountsDiamond?: string;
  charityApplications?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:CharityApplications", "Will deploy CharityApplication contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
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
      const {deployer} = await getSigners(hre);

      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;

      const charityApplications = await deployCharityApplications(
        accountsDiamond,
        addresses.multiSig.proxyAdmin,
        addresses.tokens.seedAsset,
        deployer,
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        charityApplications: charityApplications.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, charityApplications.implementation);
        await verify(hre, charityApplications.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
