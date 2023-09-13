import {task} from "hardhat/config";
import {ITransparentUpgradeableProxy__factory, ProxyContract__factory} from "typechain-types";
import {confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";

type TaskArgs = {
  to?: string;
  proxy: string;
  proxyAdminPkey?: string;
  yes: boolean;
};

task("manage:changeProxyAdmin", "Will update the proxy admin the target proxy contract")
  .addOptionalParam(
    "to",
    "New proxy admin address. Make sure to use an address of an account you control. Will do a local lookup from contract-address.json if none is provided."
  )
  .addParam("proxy", "Target Proxy Contract. Must be owned by the ProxyAdminMultiSig.")
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

      logger.out(`Change admin of proxy contract at "${taskArgs.proxy}" to: ${targetAddress}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      if (addresses.multiSig.proxyAdmin === targetAddress) {
        return logger.out(`"${targetAddress}" is already the proxy admin.`);
      }

      const proxyContract = ProxyContract__factory.connect(taskArgs.proxy, hre.ethers.provider);
      const curAdmin = await proxyContract.getAdmin();
      logger.out(`Current Admin: ${curAdmin}`);

      // submitting the Tx
      const data = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "changeAdmin",
        [targetAddress]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        proxyContract.address,
        data
      );

      if (isExecuted) {
        const newProxyAdmin = await proxyContract.getAdmin();
        if (newProxyAdmin !== targetAddress) {
          throw new Error(
            `Unexpected: expected new proxy admin "${targetAddress}", but got "${newProxyAdmin}"`
          );
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
