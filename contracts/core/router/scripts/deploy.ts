import {HardhatRuntimeEnvironment} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ProxyContract__factory, Router__factory} from "typechain-types";
import {Deployment, getContractName, logger, updateAddresses} from "utils";

export async function deployRouter(
  registrar: string,
  proxyAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying Router...");

  // deploy implementation
  logger.out("Deploying implementation...");
  const routerFactory = new Router__factory(deployer);
  const router = await routerFactory.deploy();
  await router.deployed();
  logger.out(`Address: ${router.address}.`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = router.interface.encodeFunctionData("initialize", [registrar]);
  const routerProxyFactory = new ProxyContract__factory(deployer);
  const routerProxy = await routerProxyFactory.deploy(router.address, proxyAdmin, initData);
  await routerProxy.deployed();
  logger.out(`Address: ${routerProxy.address}.`);

  // update address file & verify contracts
  await updateAddresses(
    {router: {implementation: router.address, proxy: routerProxy.address}},
    hre
  );

  return {
    implementation: {address: router.address, contractName: getContractName(routerFactory)},
    proxy: {address: routerProxy.address, contractName: getContractName(routerProxyFactory)},
  };
}
