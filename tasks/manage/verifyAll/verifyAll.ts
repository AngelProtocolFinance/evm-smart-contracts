import {CONFIG} from "config";
import {ContractFactory} from "ethers";
import {task} from "hardhat/config";
import {
  EndowmentMultiSigFactory__factory,
  EndowmentMultiSig__factory,
  GasFwdFactory__factory,
  GasFwd__factory,
  ProxyAdminMultiSig__factory,
} from "typechain-types";
import {Deployment} from "types";
import {getAddresses, getChainId, getContractName, getSigners, logger, verify} from "utils";
import getDiamondAddresses from "./getDiamondAddresses";
import getImplementations from "./getImplementations";

task("manage:verifyAll", "Will verify all the contracts").setAction(async (_, hre) => {
  try {
    logger.divider();
    logger.out(
      `Verifying all contracts on network '${hre.network.name}' (chain ID: ${await getChainId(
        hre
      )})...`
    );

    const {proxyAdminMultisigOwners} = await getSigners(hre);
    const addresses = await getAddresses(hre);
    const deployments: Deployment<ContractFactory>[] = [];

    // accounts diamond
    deployments.push(...(await getDiamondAddresses(addresses, hre)));
    // GasFwd
    deployments.push({
      contract: GasFwd__factory.connect(addresses.gasFwd.implementation, hre.ethers.provider),
      contractName: getContractName(GasFwd__factory),
    });
    deployments.push({
      contract: GasFwdFactory__factory.connect(addresses.gasFwd.factory, hre.ethers.provider),
      contractName: getContractName(GasFwdFactory__factory),
      constructorArguments: [
        addresses.gasFwd.implementation,
        addresses.multiSig.proxyAdmin,
        addresses.registrar.proxy,
      ],
    });
    // EndowmentMultiSig(+Factory)
    deployments.push({
      contract: EndowmentMultiSig__factory.connect(
        addresses.multiSig.endowment.implementation,
        hre.ethers.provider
      ),
      contractName: getContractName(EndowmentMultiSig__factory),
    });
    deployments.push({
      contract: EndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory,
        hre.ethers.provider
      ),
      contractName: getContractName(EndowmentMultiSigFactory__factory),
      constructorArguments: [
        addresses.multiSig.endowment.implementation,
        addresses.multiSig.proxyAdmin,
        addresses.registrar.proxy,
      ],
    });
    // ProxyAdminMultiSig
    deployments.push({
      contract: ProxyAdminMultiSig__factory.connect(
        addresses.multiSig.proxyAdmin,
        hre.ethers.provider
      ),
      contractName: getContractName(ProxyAdminMultiSig__factory),
      constructorArguments: [
        proxyAdminMultisigOwners
          ? proxyAdminMultisigOwners.map((x) => x.address)
          : CONFIG.PROD_CONFIG.ProxyAdminMultiSigOwners,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.threshold,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.requireExecution,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.transactionExpiry,
      ],
    });
    // all contracts hidden behind proxies
    deployments.push(...getImplementations(addresses, hre));

    for (const deployment of deployments) {
      await verify(hre, deployment);
    }
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
});
