import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ADDRESS_ZERO, ContractFunctionParams, getSigners, logger, updateAddresses} from "utils";
import {ProxyContract__factory, Router__factory} from "typechain-types";

export async function deployRouter(
  axelarGateway: string,
  gasReceiver: string,
  registrar: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying Router...");

    // deploy implementation
    const routerFactory = new Router__factory(proxyAdmin);
    const router = await routerFactory.deploy();
    await router.deployed();
    logger.out(`Router deployed at: ${router.address}.`);

    // deploy proxy
    const network = await hre.ethers.provider.getNetwork();
    const initData = router.interface.encodeFunctionData("initialize", [
      network.name,
      axelarGateway,
      gasReceiver,
      registrar,
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

    await updateAddresses(
      {router: {implementation: router.address, proxy: routerProxy.address}},
      hre
    );

    if (verify_contracts) {
      logger.out("Verifying...");
      await hre.run("verify:verify", {
        address: router.address,
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: routerProxy.address,
        constructorArguments,
      });
    }

    return {implementation: router, proxy: routerProxy};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      implementation: Router__factory.connect(ADDRESS_ZERO, proxyAdmin),
      proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
