import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike} from "ethers";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  IMultiSigGeneric__factory,
  ITransparentUpgradeableProxy__factory,
  OwnershipFacet__factory,
  ProxyContract__factory,
} from "typechain-types";
import {
  AddressObj,
  confirmAction,
  getAddresses,
  getEvents,
  getProxyAdminOwner,
  logger,
} from "utils";

type TaskArgs = {
  proxyAdminPkey: string;
  newProxyAdmin: string;
  yes: boolean;
};

task("manage:changeProxyAdmin", "Will update the proxy admin for all proxy contracts")
  .addOptionalParam(
    "proxyAdminPkey",
    "The pkey for one of the current ProxyAdminMultiSig's owners."
  )
  .addParam(
    "newProxyAdmin",
    "New admin address. Make sure to use an address of an account listed in the hardhat configuration for the target network."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Change all contracts' admin to: ${taskArgs.newProxyAdmin}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      if (proxyAdminOwner.address === taskArgs.newProxyAdmin) {
        return logger.out(`"${taskArgs.newProxyAdmin}" is already the proxy admin.`);
      }

      const addresses = await getAddresses(hre);

      await transferAccountOwnership(proxyAdminOwner, taskArgs.newProxyAdmin, addresses, hre);

      await changeProxiesAdmin(proxyAdminOwner, taskArgs.newProxyAdmin, addresses, hre);

      await hre.run("manage:registrar:updateConfig", {
        proxyAdmin: taskArgs.newProxyAdmin, //address
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

async function transferAccountOwnership(
  proxyAdminOwner: SignerWithAddress,
  newProxyAdmin: string,
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
) {
  try {
    logger.out("Transferring Account diamond ownership...");

    const ownershipFacet = OwnershipFacet__factory.connect(
      addresses.accounts.diamond,
      hre.ethers.provider
    );
    const data = ownershipFacet.interface.encodeFunctionData("transferOwnership", [newProxyAdmin]);

    const isExecuted = await submitMultiSigTx(
      addresses.multiSig.proxyAdmin,
      proxyAdminOwner,
      ownershipFacet.address,
      data
    );

    if (isExecuted) {
      const newOwner = await ownershipFacet.owner();
      logger.out(`Owner is now set to: ${newOwner}`);
    }
  } catch (error) {
    logger.out(`Failed to change admin for Account diamond, reason: ${error}`, logger.Level.Error);
  }
}

/**
 * Edge case: changing proxy admin address for all contracts that implement `fallback` function
 * will never revert, but will nevertheless NOT update the admin.
 */
async function changeProxiesAdmin(
  proxyAdminOwner: SignerWithAddress,
  newProxyAdmin: string,
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Reading proxy contract addresses...");

  const proxies = extractProxyContractAddresses("", addresses);

  for (const proxy of proxies) {
    try {
      logger.divider();
      logger.out(`Changing admin for ${proxy.name}...`);

      const proxyContract = ProxyContract__factory.connect(proxy.address, hre.ethers.provider);
      const curAdmin = await proxyContract.getAdmin();
      logger.out(`Current Admin: ${curAdmin}`);

      const data = ITransparentUpgradeableProxy__factory.createInterface().encodeFunctionData(
        "changeAdmin",
        [newProxyAdmin]
      );
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        proxy.address,
        data
      );

      if (isExecuted) {
        const proxyContract = ProxyContract__factory.connect(proxy.address, hre.ethers.provider);
        const newAdmin = await proxyContract.getAdmin();
        logger.out(`New admin: ${newAdmin}`);
      }
    } catch (error) {
      logger.out(`Failed to change admin, reason: ${error}`, logger.Level.Error);
    }
  }
}

function extractProxyContractAddresses(key: string, value: any): {name: string; address: string}[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if ("proxy" in value && !!value.proxy) {
    return [{name: key, address: value.proxy}];
  }

  return Object.entries(value).flatMap(([key, val]) => extractProxyContractAddresses(key, val));
}

async function submitMultiSigTx(
  msAddress: string,
  proxyAdminOwner: SignerWithAddress,
  destination: string,
  data: BytesLike
): Promise<boolean> {
  logger.out(`Submitting transaction to Multisig at address: ${msAddress}...`);
  const multisig = IMultiSigGeneric__factory.connect(msAddress, proxyAdminOwner);
  const tx = await multisig.submitTransaction(destination, 0, data, "0x");
  logger.out(`Tx hash: ${tx.hash}`);
  const receipt = await tx.wait();

  const transactionExecutedEvent = getEvents(
    receipt.events,
    multisig,
    multisig.filters.TransactionExecuted()
  ).at(0);
  if (transactionExecutedEvent) {
    return true;
  }

  const transactionSubmittedEvent = getEvents(
    receipt.events,
    multisig,
    multisig.filters.TransactionSubmitted()
  ).at(0);
  if (!transactionSubmittedEvent) {
    throw new Error("Unexpected: TransactionSubmitted not emitted.");
  }

  const txId = transactionSubmittedEvent.args.transactionId;

  const isConfirmed = await multisig.isConfirmed(txId);
  if (!isConfirmed) {
    logger.out(`Transaction with ID "${txId}" submitted, awaiting confirmation by other owners.`);
    return false;
  }

  // is confirmed but not executed -> requires manual execution
  logger.out(`Executing the new charity endowment with transaction ID: ${txId}...`);
  const tx2 = await multisig.executeTransaction(txId);
  logger.out(`Tx hash: ${tx2.hash}`);
  const execReceipt = await tx2.wait();

  const txExecuted = getEvents(
    execReceipt.events,
    multisig,
    multisig.filters.TransactionExecuted()
  ).at(0);
  if (!txExecuted) {
    throw new Error("Unexpected: TransactionExecuted not emitted.");
  }

  return true;
}
