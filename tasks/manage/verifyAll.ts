import {CONFIG} from "config";
import {ContractFactory} from "ethers";
import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  APTeamMultiSig__factory,
  CharityApplications__factory,
  Diamond__factory,
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSigFactory__factory,
  EndowmentMultiSig__factory,
  GasFwdFactory__factory,
  GasFwd__factory,
  IndexFund__factory,
  ProxyAdminMultiSig__factory,
  Registrar__factory,
  Router__factory,
  VaultEmitter__factory,
} from "typechain-types";
import {Deployment} from "types";
import {
  AddressObj,
  getAddresses,
  getChainId,
  getContractName,
  getSigners,
  logger,
  verify,
} from "utils";

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

// no need to pass constructor arguments, they're initiated by their proxies using
// their respective initializer functions
function getImplementations(
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
): Deployment<ContractFactory>[] {
  const result: Deployment<ContractFactory>[] = [];

  result.push({
    contract: IndexFund__factory.connect(addresses.indexFund.implementation, hre.ethers.provider),
    contractName: getContractName(IndexFund__factory),
  });
  result.push({
    contract: CharityApplications__factory.connect(
      addresses.multiSig.charityApplications.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(CharityApplications__factory),
  });
  result.push({
    contract: APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(APTeamMultiSig__factory),
  });
  result.push({
    contract: EndowmentMultiSigEmitter__factory.connect(
      addresses.multiSig.endowment.emitter.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(EndowmentMultiSigEmitter__factory),
  });
  result.push({
    contract: Registrar__factory.connect(addresses.registrar.implementation, hre.ethers.provider),
    contractName: getContractName(Registrar__factory),
  });
  result.push({
    contract: Router__factory.connect(addresses.router.implementation, hre.ethers.provider),
    contractName: getContractName(Router__factory),
  });
  result.push({
    contract: VaultEmitter__factory.connect(
      addresses.vaultEmitter.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(VaultEmitter__factory),
  });

  return result;
}

async function getDiamondAddresses(
  {accounts}: AddressObj,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<ContractFactory>[]> {
  if (!accounts.diamond) {
    return [];
  }

  const {deployer} = await getSigners(hre);
  const result: Deployment<ContractFactory>[] = [
    {
      contract: Diamond__factory.connect(accounts.diamond, hre.ethers.provider),
      contractName: getContractName(Diamond__factory),
      constructorArguments: [deployer.address, accounts.facets.diamondCutFacet],
    },
  ];

  for (const [facetName, address] of Object.entries(accounts.facets)) {
    if (!address) {
      continue;
    }
    const contractName = capitalize(facetName);
    result.push({
      contract: await hre.ethers.getContractAt(contractName, address),
      contractName,
    });
  }

  return result;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
