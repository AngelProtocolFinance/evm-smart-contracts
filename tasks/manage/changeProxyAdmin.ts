import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  ITransparentUpgradeableProxy__factory,
  OwnershipFacet__factory,
  ProxyContract__factory,
} from "typechain-types";
import {AddressObj, confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";
import {Wallet} from "ethers";

type TaskArgs = {
  apTeamSignerPkey?: string;
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
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
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
        proxyAdmin: taskArgs.newProxyAdmin,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

async function transferAccountOwnership(
  proxyAdminOwner: SignerWithAddress | Wallet,
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
  proxyAdminOwner: SignerWithAddress | Wallet,
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
