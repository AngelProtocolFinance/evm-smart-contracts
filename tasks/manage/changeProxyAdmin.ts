import {task} from "hardhat/config";
import {ITransparentUpgradeableProxy__factory, ProxyContract__factory} from "typechain-types";
import {confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";
import {cliTypes} from "tasks/types";

type TaskArgs = {
  to?: string;
  proxy: string;
  proxyAdminPkey?: string;
  yes: boolean;
};

task("manage:changeProxyAdmin", "Will update the proxy admin the target proxy contract")
  .addOptionalParam(
    "to",
    "New proxy admin address. Make sure to use an address of an account you control. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addParam(
    "proxy",
    "Target Proxy Contract. Must be owned by the ProxyAdminMultiSig.",
    undefined,
    cliTypes.address
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

      logger.out(`Change admin of proxy contract at "${taskArgs.proxy}" to: ${targetAddress}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      const proxyContract = ProxyContract__factory.connect(taskArgs.proxy, hre.ethers.provider);
      const curAdmin = await proxyContract.getAdmin();

      if (curAdmin === targetAddress) {
        return logger.out(`"${targetAddress}" is already the proxy admin.`);
      }

      logger.out(`Current Admin: ${curAdmin}`);

      // submitting the Tx
      const data = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "changeAdmin",
        [targetAddress]
      );
      // make sure to use current proxy admin MultiSig, as the task might be run with the proxyAdmin address
      // already updated in contract-address.json
      const isExecuted = await submitMultiSigTx(
        curAdmin,
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
