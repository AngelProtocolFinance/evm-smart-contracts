import {BytesLike, ContractFactory} from "ethers";
import {ProxyContract__factory} from "typechain-types";
import {getContractName, logger} from ".";

type Deployment<T extends ContractFactory> = {
  constructorArguments?: Parameters<T["deploy"]>;
  contract: Awaited<ReturnType<T["deploy"]>>;
  contractName: string;
};

/**
 * Deploys a contract; includes logging of the relevant data
 *
 * Note: Deployment tx hash is logged only if the deployment fails.
 * Otherwise the tx hash can be obtained by using the contract address to search the relevant Tx explorer.
 *
 * @param factory contract factory used to deploy the contract
 * @param constructorArguments contract's constructor arguments
 * @returns (Deployment) object containing deployment data (including the contract instance)
 */
export async function deploy<T extends ContractFactory>(
  factory: T,
  constructorArguments?: Parameters<T["deploy"]>
): Promise<Deployment<T>> {
  const contractName = getContractName(factory);
  logger.out(`Deploying ${contractName}...`);
  const contract = await factory.deploy(...(constructorArguments ?? []));
  try {
    await contract.deployed();
    logger.out(`Address: ${contract.address}`);
    return {
      constructorArguments,
      contractName,
      contract: contract as Awaited<ReturnType<T["deploy"]>>,
    };
  } catch (error) {
    logger.out(`Tx hash: ${contract.deployTransaction.hash}`);
    throw error;
  }
}

/**
 * Deploys a contract behind a proxy; includes logging of the relevant data.
 *
 * Note: Deployment tx hash is logged only if the deployment fails.
 * Otherwise the tx hash can be obtained by using the contract address to search the relevant Tx explorer.
 *
 * @param factory contract factory used to deploy the contract
 * @param proxyAdmin proxy admin address
 * @param initData data used to initialize the contract
 * @returns object containing both implementation and proxy deployment data (including the contract instances)
 */
export async function deployBehindProxy<T extends ContractFactory>(
  factory: T,
  proxyAdmin: string,
  initData: BytesLike
): Promise<{
  implementation: Deployment<T>;
  proxy: Deployment<ProxyContract__factory>;
}> {
  const implementation = await deploy(factory);
  const proxy = await deploy(new ProxyContract__factory(factory.signer), [
    implementation.contract.address,
    proxyAdmin,
    initData,
  ]);

  return {implementation, proxy};
}
