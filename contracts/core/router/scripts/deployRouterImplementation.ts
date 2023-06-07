import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Router__factory} from "typechain-types";
import {getSigners, logger} from "utils";

export default async function deployRouterImplementation(hre: HardhatRuntimeEnvironment) {
  const {proxyAdmin} = await getSigners(hre.ethers);

  const routerFactory = new Router__factory(proxyAdmin);
  const router = await routerFactory.deploy();
  await router.deployed();

  logger.out(`Router deployed at: ${router.address}.`);

  return router;
}
