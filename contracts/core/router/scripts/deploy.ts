import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Router__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployRouter(
  registrar: string,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying Router...");

  const {proxyAdmin} = await getSigners(hre);

  // deploy implementation
  logger.out("Deploying implementation...");
  const routerFactory = new Router__factory(proxyAdmin);
  const router = await routerFactory.deploy();
  await router.deployed();
  logger.out(`Address: ${router.address}.`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = router.interface.encodeFunctionData("initialize", [registrar]);
  const routerProxyFactory = new ProxyContract__factory(proxyAdmin);
  const routerProxy = await routerProxyFactory.deploy(router.address, proxyAdmin.address, initData);
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
