import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  IAccounts__factory,
  ProxyAdminMultiSig__factory,
  ProxyContract__factory,
} from "typechain-types";
import {getAddresses, getProxyAdminOwner, logger} from "utils";

class CheckError extends Error {}

export default async function updateEndowmentProxiesAdmin(
  targetAddress: string,
  proxyAdminPkey: string | undefined,
  hre: HardhatRuntimeEnvironment
) {
  const proxyAdminOwner = await getProxyAdminOwner(hre, proxyAdminPkey);

  const endowmentAddresses: string[] = await getEndowmentAddresses(hre);

  for (const endowmentProxy of endowmentAddresses) {
    try {
      await checkIfManagedByProxyAdmin(endowmentProxy, await proxyAdminOwner.getAddress(), hre);

      await hre.run("manage:changeProxyAdmin", {
        to: targetAddress,
        proxy: endowmentProxy,
        proxyAdminPkey: proxyAdminPkey,
        yes: true,
      });
    } catch (error) {
      const logLevel = error instanceof CheckError ? logger.Level.Warn : logger.Level.Error;
      logger.out(error, logLevel);
    }
  }
}

async function getEndowmentAddresses(hre: HardhatRuntimeEnvironment) {
  const result: string[] = [];

  const addresses = await getAddresses(hre);

  const accounts = IAccounts__factory.connect(addresses.accounts.diamond, hre.ethers.provider);

  const maxAccountId = (await accounts.queryConfig()).nextAccountId.sub(1);
  for (let endowId = 1; maxAccountId.gte(endowId); endowId++) {
    const endowment = await accounts.queryEndowmentDetails(endowId);
    result.push(endowment.owner);
  }

  return result;
}

/**
 * It is possible the Endowment's proxy is not managed by our ProxyAdminMultiSig.
 * In those cases we should skip submitting any Txs to avoid wasting gas.
 *
 * This is just a rudimendaty check that will throw if `curAdmin` is not really a ProxyAdminMultiSig
 * in which case it'll throw and stop the execution. We check this by assuming that if the address
 * is connected to a contract that contains the `submitTransaction` and `isOwner` functions and also
 * that the currently used proxy admin owner is really one of the owners of of the proxy's admin contract,
 * then it's most likely that the said proxy admin contract is an instance of ProxyAdminMultiSig.
 *
 * @param proxy Address of the proxy to check
 * @param proxyAdminOwner Address of one of the current proxy admin's owners
 * @param hre HardhatRuntimeEnvironment
 */
async function checkIfManagedByProxyAdmin(
  proxy: string,
  proxyAdminOwner: string,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const proxyContract = ProxyContract__factory.connect(proxy, hre.ethers.provider);
  const curAdmin = await proxyContract.getAdmin();

  const proxyAdminMS = ProxyAdminMultiSig__factory.connect(curAdmin, hre.ethers.provider);
  const bytecode = await hre.ethers.provider.getCode(curAdmin);

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

  if (!(await proxyAdminMS.isOwner(proxyAdminOwner))) {
    throw new CheckError(
      `Skipping: "${proxyAdminOwner}" is not one of the target contract's owners`
    );
  }
}
