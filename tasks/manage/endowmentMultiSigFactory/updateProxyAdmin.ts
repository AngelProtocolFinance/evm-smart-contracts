import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

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

      const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory,
        hre.ethers.provider
      );
      const oldProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
      if (oldProxyAdmin === targetAddress) {
        return logger.out(`"${targetAddress}" is already the proxy admin.`);
      }

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      // submitting the Tx
      const data = endowmentMultiSigFactory.interface.encodeFunctionData("updateProxyAdmin", [
        targetAddress,
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        endowmentMultiSigFactory.address,
        data
      );
      if (!isExecuted) {
        return;
      }
      const newProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
      if (newProxyAdmin !== targetAddress) {
        throw new Error(
          `Unexpected: expected new proxy admin "${targetAddress}", but got "${newProxyAdmin}"`
        );
      }

      // update existing EndowmentMultiSig Proxies' admins
      const endowmentProxies = await endowmentMultiSigFactory.getInstantiations();

      for (const endowmentProxy of endowmentProxies) {
        await hre.run("manage:changeProxyAdmin", {
          to: targetAddress,
          proxy: endowmentProxy,
          proxyAdminPkey: taskArgs.proxyAdminPkey,
          yes: true,
        });
      }
    } catch (error) {
      logger.out(
        `Updating EndowmentMultiSigFactory's proxy admin failed, reason: ${error}`,
        logger.Level.Error
      );
    }
  });
