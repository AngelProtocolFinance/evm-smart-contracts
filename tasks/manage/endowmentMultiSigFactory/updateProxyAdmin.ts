import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {
  to: string;
  apTeamSignerPkey?: string;
  proxyAdminPkey: string;
  yes: boolean;
};

task(
  "manage:endowmentMultiSigFactory:updateProxyAdmin",
  "Will update the EndowmentMultiSigFactory's proxy admin address"
)
  .addParam("to", "New proxy admin address. Make sure to use an address of an account you control.")
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
      logger.out(`Updating EndowmentMultiSigFactory's proxy admin to ${taskArgs.to}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory,
        hre.ethers.provider
      );
      const oldProxyAdmin = await endowmentMultiSigFactory.getProxyAdmin();
      if (oldProxyAdmin === taskArgs.to) {
        return logger.out(`"${taskArgs.to}" is already the proxy admin.`);
      }

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      logger.out("Submitting Tx...");
      const data = endowmentMultiSigFactory.interface.encodeFunctionData("updateProxyAdmin", [
        taskArgs.to,
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
      if (newProxyAdmin !== taskArgs.to) {
        throw new Error(
          `Unexpected: expected new proxy admin "${taskArgs.to}", but got "${newProxyAdmin}"`
        );
      }

      // update existing EndowmentMultiSig Proxies' admins
      const endowmentProxies = await endowmentMultiSigFactory.getInstantiations();

      for (const endowmentProxy of endowmentProxies) {
        await hre.run("manage:changeProxyAdmin", {
          to: taskArgs.to,
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
