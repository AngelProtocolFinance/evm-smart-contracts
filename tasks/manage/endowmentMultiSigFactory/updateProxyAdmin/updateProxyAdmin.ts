import {task} from "hardhat/config";
import {confirmAction, getAddresses, logger} from "utils";
import updateEndowmentMultiSigFactory from "./updateEndowmentMultiSigFactory";
import updateEndowmentProxiesAdmin from "./updateEndowmentProxiesAdmin";

type TaskArgs = {
  to?: string;
  apTeamSignerPkey?: string;
  proxyAdminPkey: string;
  yes: boolean;
};

task(
  "manage:endowmentMultiSigFactory:updateProxyAdmin",
  "Will update the EndowmentMultiSigFactory's proxy admin address"
)
  .addOptionalParam(
    "to",
    "New proxy admin address. Make sure to use an address of an account you control. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addOptionalParam(
    "proxyAdminPkey",
    "The pkey for one of the current ProxyAdminMultiSig's owners."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const addresses = await getAddresses(hre);
      const targetAddress = taskArgs.to || addresses.multiSig.proxyAdmin;

      logger.out(`Updating EndowmentMultiSigFactory's proxy admin to ${targetAddress}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      // submit Tx to update proxy admin in EndowmentMultiSigFactory's state
      const isUpdated = await updateEndowmentMultiSigFactory(
        targetAddress,
        taskArgs.apTeamSignerPkey,
        hre
      );
      // wait for proxy admin update Tx to be executed before updating existing EndowmentMultiSigs
      if (!isUpdated) {
        return;
      }

      // update existing EndowmentMultiSig Proxies' admins
      await updateEndowmentProxiesAdmin(targetAddress, taskArgs.proxyAdminPkey, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
