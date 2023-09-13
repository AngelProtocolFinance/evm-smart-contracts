import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Wallet} from "ethers";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {OwnershipFacet__factory} from "typechain-types";
import {AddressObj, confirmAction, getAddresses, getProxyAdminOwner, logger} from "utils";
import {submitMultiSigTx} from "../helpers";

type TaskArgs = {
  to?: string;
  apTeamSignerPkey?: string;
  proxyAdminPkey?: string;
  yes: boolean;
};

task("manage:changeProxyAdminForAll", "Will update the proxy admin for all proxy contracts")
  .addOptionalParam(
    "to",
    "New proxy admin address. Make sure to use an address of an account you control. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "proxyAdminPkey",
    "The pkey for one of the current ProxyAdminMultiSig's owners."
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const addresses = await getAddresses(hre);
      const targetAddress = taskArgs.to || addresses.multiSig.proxyAdmin;

      logger.out(`Change all contracts' admin to: ${targetAddress}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      if (addresses.multiSig.proxyAdmin === targetAddress) {
        return logger.out(`"${targetAddress}" is already the proxy admin.`);
      }

      await transferAccountOwnership(proxyAdminOwner, targetAddress, addresses, hre);

      await changeProxiesAdmin(taskArgs.proxyAdminPkey, targetAddress, addresses, hre);

      await hre.run("manage:endowmentMultiSigFactory:updateProxyAdmin", {
        to: targetAddress,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        proxyAdminPkey: taskArgs.proxyAdminPkey,
        yes: true,
      });

      await hre.run("manage:registrar:updateConfig", {
        proxyAdmin: targetAddress,
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
    logger.out("Transferring Account diamond ownership (admin)...");

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
      if (newOwner !== newProxyAdmin) {
        throw new Error(
          `Unexpected: expected new proxy admin "${newProxyAdmin}", but got "${newOwner}"`
        );
      }
      logger.out(`Owner is now set to: ${newOwner}`);
    }
  } catch (error) {
    logger.out(`Failed to change admin for Account diamond, reason: ${error}`, logger.Level.Error);
  }
}

/**
 * Edge case: changing proxy admin address with a non-owning signer for all contracts that
 * implement `fallback` function will never revert, but will nevertheless NOT update the admin.
 */
async function changeProxiesAdmin(
  proxyAdminPkey: string | undefined,
  newProxyAdmin: string,
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Reading proxy contract addresses...");
  const proxies = extractProxyContractAddresses("", addresses);

  for (const proxy of proxies) {
    await hre.run("manage:changeProxyAdmin", {
      to: newProxyAdmin,
      proxy: proxy.address,
      proxyAdminPkey: proxyAdminPkey,
      yes: true,
    });
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
