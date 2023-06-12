import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Router} from "typechain-types";
import {ContractFunctionParams, getSigners, logger} from "utils";

export default async function deployRouterProxy(
  router: Router,
  axelarGateway: string,
  gasReceiver: string,
  registrarAddress: string,
  hre: HardhatRuntimeEnvironment
) {
  const network = await hre.ethers.provider.getNetwork();
  const {proxyAdmin} = await getSigners(hre);

  const initData = router.interface.encodeFunctionData("initialize", [
    network.name,
    axelarGateway,
    gasReceiver,
    registrarAddress,
  ]);
  const constructorArguments: ContractFunctionParams<ProxyContract__factory["deploy"]> = [
    router.address,
    proxyAdmin.address,
    initData,
  ];
  const routerProxyFactory = new ProxyContract__factory(proxyAdmin);
  const routerProxy = await routerProxyFactory.deploy(...constructorArguments);
  await routerProxy.deployed();
  logger.out(`Router Proxy deployed at: ${routerProxy.address}.`);

  return {routerProxy, constructorArguments};
}
