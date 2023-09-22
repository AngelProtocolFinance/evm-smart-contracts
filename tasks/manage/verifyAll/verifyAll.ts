import {CONFIG} from "config";
import {ContractFactory} from "ethers";
import {task} from "hardhat/config";
import {
  EndowmentMultiSig__factory,
  GasFwdFactory__factory,
  GasFwd__factory,
  ProxyAdminMultiSig__factory,
} from "typechain-types";
import {Deployment} from "types";
import {getAddresses, getChainId, getContractName, getSigners, logger, verify} from "utils";
import getDiamondAddresses from "./getDiamondAddresses";
import getProxies from "./getProxies";

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
    // EndowmentMultiSig
    deployments.push({
      contract: EndowmentMultiSig__factory.connect(
        addresses.multiSig.endowment.implementation,
        hre.ethers.provider
      ),
      contractName: getContractName(EndowmentMultiSig__factory),
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
          ? await Promise.all(proxyAdminMultisigOwners.map((x) => x.getAddress()))
          : CONFIG.PROD_CONFIG.ProxyAdminMultiSigOwners,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.threshold,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.requireExecution,
        CONFIG.PROXY_ADMIN_MULTISIG_DATA.transactionExpiry,
      ],
    });
    // all contracts' proxies and their implementations
    deployments.push(...getProxies(addresses, hre));

    for (const deployment of deployments) {
      await verify(hre, deployment);
    }
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
});
