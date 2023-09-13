import {task} from "hardhat/config";
import {ITransparentUpgradeableProxy__factory, ProxyContract__factory} from "typechain-types";
import {confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";

type TaskArgs = {
  to: string;
  proxy: string;
  proxyAdminPkey?: string;
  yes: boolean;
};

task("manage:changeProxyAdmin", "Will update the proxy admin the target proxy contract")
  .addParam("to", "New proxy admin address. Make sure to use an address of an account you control.")
  .addParam("proxy", "Target Proxy Contract. Must be owned by the ProxyAdminMultiSig.")
  .addOptionalParam(
    "proxyAdminPkey",
    "The pkey for one of the current ProxyAdminMultiSig's owners."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out(`Change admin of proxy contract at "${taskArgs.proxy}" to: ${taskArgs.to}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      if (addresses.multiSig.proxyAdmin === taskArgs.to) {
        return logger.out(`"${taskArgs.to}" is already the proxy admin.`);
      }

      const proxyContract = ProxyContract__factory.connect(taskArgs.proxy, hre.ethers.provider);
      const curAdmin = await proxyContract.getAdmin();
      logger.out(`Current Admin: ${curAdmin}`);

      logger.out("Submitting Tx...");
      const data = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "changeAdmin",
        [taskArgs.to]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        proxyContract.address,
        data
      );

      if (isExecuted) {
        const newProxyAdmin = await proxyContract.getAdmin();
        if (newProxyAdmin !== taskArgs.to) {
          throw new Error(
            `Unexpected: expected new proxy admin "${taskArgs.to}", but got "${newProxyAdmin}"`
          );
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
