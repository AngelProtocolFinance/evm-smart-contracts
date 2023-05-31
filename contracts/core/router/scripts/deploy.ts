// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Router__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deployRouter(
  axelarGateway: string,
  gasReceiver: string,
  registrar: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying Router...");

  const network = await hre.ethers.provider.getNetwork();

  logger.out(JSON.stringify({network: network.name, axelarGateway, gasReceiver, registrar}));

  const {proxyAdmin} = await getSigners(hre.ethers);

  const routerFactory = new Router__factory(proxyAdmin);
  const router = await routerFactory.deploy();
  await router.deployed();
  logger.out(`Router deployed at: ${router.address}.`);

  const initData = router.interface.encodeFunctionData("initialize", [
    network.name,
    axelarGateway,
    gasReceiver,
    registrar,
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const proxy = await proxyFactory.deploy(router.address, proxyAdmin.address, initData);
  await proxy.deployed();
  logger.out(`Router Proxy deployed at: ${proxy.address}.`);

  await updateAddresses({router: {implementation: router.address, proxy: proxy.address}}, hre);

  if (verify_contracts) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: router.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: proxy.address,
      constructorArguments: [router.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: router.address, proxy: proxy.address};
}
