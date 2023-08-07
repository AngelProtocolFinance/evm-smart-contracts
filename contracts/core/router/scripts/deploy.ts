import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Router__factory} from "typechain-types";
import {
  ContractFunctionParams,
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
  validateAddress,
} from "utils";

export async function deployRouter(
  registrar = "",
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Router...");

  const {proxyAdmin} = await getSigners(hre);

  try {
    validateAddress(registrar, "registrar");

    // deploy implementation
    logger.out("Deploying implementation...");
    const routerFactory = new Router__factory(proxyAdmin);
    const router = await routerFactory.deploy();
    await router.deployed();
    logger.out(`Address: ${router.address}.`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const network = await hre.ethers.provider.getNetwork();
    const initData = router.interface.encodeFunctionData("initialize", [network.name, registrar]);
    const constructorArguments: ContractFunctionParams<ProxyContract__factory["deploy"]> = [
      router.address,
      proxyAdmin.address,
      initData,
    ];
    const routerProxyFactory = new ProxyContract__factory(proxyAdmin);
    const routerProxy = await routerProxyFactory.deploy(...constructorArguments);
    await routerProxy.deployed();
    logger.out(`Address: ${routerProxy.address}.`);

    // update address file & verify contracts
    await updateAddresses(
      {router: {implementation: router.address, proxy: routerProxy.address}},
      hre
    );

    return {address: routerProxy.address, contractName: getContractName(routerFactory)};
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
