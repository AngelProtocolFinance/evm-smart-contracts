import {task} from "hardhat/config";
import {ITransparentUpgradeableProxy__factory, ProxyContract__factory} from "typechain-types";
import {confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";

type TaskArgs = {
  newProxyAdmin: string;
  proxyContract: string;
  proxyAdminPkey?: string;
  yes: boolean;
};

task("manage:changeProxyAdmin", "Will update the proxy admin the target proxy contract")
  .addParam(
    "newProxyAdmin",
    "New admin address. Make sure to use an address of an account you control."
  )
  .addParam("proxyContract", "Target Proxy Contract. Must be owned by the ProxyAdminMultiSig.")
  .addOptionalParam(
    "proxyAdminPkey",
    "The pkey for one of the current ProxyAdminMultiSig's owners."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(
          `Change admin of proxy contract at "${taskArgs.proxyContract}" to: ${taskArgs.newProxyAdmin}`
        ));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      if (addresses.multiSig.proxyAdmin === taskArgs.newProxyAdmin) {
        return logger.out(`"${taskArgs.newProxyAdmin}" is already the proxy admin.`);
      }

      const proxyContract = ProxyContract__factory.connect(
        taskArgs.proxyContract,
        hre.ethers.provider
      );
      const curAdmin = await proxyContract.getAdmin();
      logger.out(`Current Admin: ${curAdmin}`);

      logger.out("Submitting Tx...");
      const data = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "changeAdmin",
        [taskArgs.newProxyAdmin]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        proxyContract.address,
        data
      );

      if (isExecuted) {
        const newProxyAdmin = await proxyContract.getAdmin();
        if (newProxyAdmin !== taskArgs.newProxyAdmin) {
          throw new Error(
            `Unexpected: expected new proxy admin "${taskArgs.newProxyAdmin}", but got "${newProxyAdmin}"`
          );
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
