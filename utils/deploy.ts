import {BytesLike, ContractFactory, Wallet} from "ethers";
import {ITransparentUpgradeableProxy__factory, ProxyContract__factory} from "typechain-types";
import {Deployment, ProxyDeployment} from "types";
import {getContractName, logger} from ".";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {submitMultiSigTx} from "tasks/helpers";

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

  try {
    const contract = await factory.deploy(...(constructorArguments ?? []));
    await contract.deployed();
    await delay(1000);
    logger.out(`Address: ${contract.address}`);
    return {
      constructorArguments,
      contractName,
      contract: contract as Awaited<ReturnType<T["deploy"]>>,
    };
  } catch (error: any) {
    if ("data" in error && "txHash" in error.data) {
      logger.out(`Tx hash: ${error.data.txHash}`);
    }
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
): Promise<ProxyDeployment<T>> {
  const implementation = await deploy(factory);
  const proxy = await deploy(new ProxyContract__factory(factory.signer), [
    implementation.contract.address,
    proxyAdmin,
    initData,
  ]);
  return {implementation, proxy};
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Upgrades a proxy with a new implementation contract a contract behind a proxy; includes logging of the relevant data.
 *
 * Note: Deployment tx hash is logged only if the deployment fails.
 * Otherwise the tx hash can be obtained by using the contract address to search the relevant Tx explorer.
 *
 * @param factory contract factory used to deploy the contract
 * @param proxyAdmin proxy admin address
 * @param initData data used to initialize the contract
 * @returns object containing both implementation and proxy deployment data (including the contract instances)
 */
export async function upgradeProxy<T extends ContractFactory>(
  factory: T,
  proxyAdminMultiSig: string,
  proxyAdminOwner: SignerWithAddress | Wallet,
  proxyToUpgrade: string
): Promise<Deployment<T> | undefined> {
  const deployment = await deploy(factory);

  logger.out(`Upgrading proxy at: ${proxyToUpgrade}...`);
  const proxy = ITransparentUpgradeableProxy__factory.connect(proxyToUpgrade, proxyAdminOwner);
  const payload = proxy.interface.encodeFunctionData("upgradeTo", [deployment.contract.address]);

  const isExecuted = await submitMultiSigTx(
    proxyAdminMultiSig,
    proxyAdminOwner,
    proxyToUpgrade,
    payload
  );
  if (!isExecuted) {
    // The deployment will be considered valid only once the upgrade is confirmed by other ProxyAdminMultiSig owners
    return;
  }

  const newImplAddr = await proxy.implementation();
  if (newImplAddr !== deployment.contract.address) {
    throw new Error(
      `Unexpected: expected value "${deployment.contract.address}", but got "${newImplAddr}"`
    );
  }

  return deployment;
}
