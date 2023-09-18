import {task} from "hardhat/config";
import {
  ITransparentUpgradeableProxy__factory,
  ProxyAdminMultiSig__factory,
  ProxyContract__factory,
} from "typechain-types";
import {confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

class CheckError extends Error {}

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

      const proxyContract = ProxyContract__factory.connect(taskArgs.proxy, hre.ethers.provider);
      const curAdmin = await proxyContract.getAdmin();

      if (curAdmin === targetAddress) {
        return logger.out(`"${targetAddress}" is already the proxy admin.`);
      }

      await checkIfProxyAdmin(curAdmin, proxyAdminOwner.address, hre);

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
      if (error instanceof CheckError) {
        logger.out(error, logger.Level.Warn);
      } else {
        logger.out(error, logger.Level.Error);
      }
    }
  });

/**
 * It is possible the Endowment's proxy is not managed by our ProxyAdminMultiSig.
 * In those cases we should skip submitting any Txs to avoid wasting gas.
 * @param adminAddress Address of the current proxy admin
 * @param adminOwner Address of one of the current proxy admin's owners
 * @param hre HardhatRuntimeEnvironment
 */
async function checkIfProxyAdmin(
  adminAddress: string,
  adminOwner: string,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  // this is just a rudimendaty check that will throw if `curAdmin` is not really a ProxyAdminMultiSig
  // in which case it'll throw and stop the execution. We check this by assuming that if the address
  // is connected to a contract that contains the `submitTransaction` function, then there's a high
  // likelihood that the said contract is ProxyAdminMultiSig
  const proxyAdminMS = ProxyAdminMultiSig__factory.connect(adminAddress, hre.ethers.provider);
  const bytecode = await hre.ethers.provider.getCode(adminAddress);

  // No code : "0x" then functionA is definitely not there
  if (bytecode.length <= 2) {
    throw new CheckError("Skipping: admin address has no code");
  }

  // If the bytecode doesn't include the function selector submitTransaction()
  // is definitely not present
  const submitTransactionSelector = proxyAdminMS.interface.getSighash(
    proxyAdminMS.interface.functions["submitTransaction(address,uint256,bytes,bytes)"]
  );
  if (!bytecode.includes(submitTransactionSelector.slice(2))) {
    throw new CheckError(
      "Skipping: not a ProxyAdminMultiSig - no submitTransaction() function selector in bytecode"
    );
  }

  const isOwnersSelector = proxyAdminMS.interface.getSighash(
    proxyAdminMS.interface.functions["isOwner(address)"]
  );
  if (!bytecode.includes(isOwnersSelector.slice(2))) {
    throw new CheckError(
      "Skipping: not a ProxyAdminMultiSig - no isOwner() function selector in bytecode"
    );
  }

  if (!(await proxyAdminMS.isOwner(adminOwner))) {
    throw new CheckError(`Skipping: "${adminOwner}" is not one of the target contract's owners`);
  }
}
