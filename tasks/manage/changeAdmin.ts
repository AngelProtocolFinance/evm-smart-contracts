import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ITransparentUpgradeableProxy__factory, OwnershipFacet__factory} from "typechain-types";
import {AddressObj, confirmAction, getAddresses, logger} from "utils";

task("manage:changeAdmin", "Will update the admin for all proxy contracts")
  .addParam("currentAdmin", "Current admin address")
  .addParam("newAdmin", "New admin address")
  .setAction(async (taskArguments, hre) => {
    try {
      const isConfirmed = await confirmAction(
        `You're about to set ${taskArguments.newAdmin} as the new admin`
      );
      if (!isConfirmed) {
        return logger.out("Aborting...");
      }

      const currentAdmin = await hre.ethers.getSigner(taskArguments.currentAdmin);

      const addresses = await getAddresses(hre);

      await transferAccountOwnership(currentAdmin, taskArguments.newAdmin, addresses, hre);

      await changeProxiesAdmin(currentAdmin, taskArguments.newAdmin, addresses, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });

async function transferAccountOwnership(
  currentAdmin: SignerWithAddress,
  newAdmin: string,
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const ownershipFacet = OwnershipFacet__factory.connect(
      addresses.accounts.diamond,
      currentAdmin
    );
    const tx = await ownershipFacet.transferOwnership(newAdmin);
    await hre.ethers.provider.waitForTransaction(tx.hash);
    logger.out("Transferred Account diamond ownership.");
  } catch (error) {
    logger.out(`Failed to change admin for Account diamond, reason: ${error}`, logger.Level.Error);
  }
}

async function changeProxiesAdmin(
  currentAdmin: SignerWithAddress,
  taskArguments: any,
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Reading proxy contract addresses...");

  const proxies = extractProxyContractAddresses("", addresses);

  for (const proxy of proxies) {
    try {
      const upgradeableProxy = ITransparentUpgradeableProxy__factory.connect(
        proxy.address,
        currentAdmin
      );
      const tx = await upgradeableProxy.changeAdmin(taskArguments.newAdmin);
      await hre.ethers.provider.waitForTransaction(tx.hash);
      logger.out(`Changed admin for ${proxy.name}.`);
    } catch (error) {
      logger.out(`Failed to change admin for ${proxy.name}, reason: ${error}`, logger.Level.Error);
    }
  }
}

function extractProxyContractAddresses(key: string, value: any): {name: string; address: string}[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    if (key.includes("Proxy")) {
      return [{name: key, address: value}];
    } else {
      return [];
    }
  }

  if (typeof value !== "object") {
    return [];
  }

  return Object.entries(value).flatMap(([key, val]) => extractProxyContractAddresses(key, val));
}
