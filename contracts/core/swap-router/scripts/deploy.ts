import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, SwapRouter__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deploySwapRouter(
  registrarContract: string,
  accountsContract: string,
  uniswapFactory: string,
  swapRouterAddress: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying SwapRouter...");

  const {proxyAdmin} = await getSigners(hre);

  logger.out("Deploying Implementation...");
  const swapRouterFactory = new SwapRouter__factory(proxyAdmin);
  const swapRouter = await swapRouterFactory.deploy();
  await swapRouter.deployed();
  logger.out(`Address: ${swapRouter.address}`);

  logger.out("Deploying Proxy...");
  const initData = swapRouter.interface.encodeFunctionData("initSwapRouter", [
    {
      registrarContract,
      accountsContract,
      swapFactory: uniswapFactory,
      swapRouter: swapRouterAddress,
    },
  ]);
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const swapRouterProxy = await proxyFactory.deploy(
    swapRouter.address,
    proxyAdmin.address,
    initData
  );
  await swapRouterProxy.deployed();
  logger.out(`Address: ${swapRouterProxy.address}`);

  await updateAddresses(
    {
      swapRouter: {
        proxy: swapRouterProxy.address,
        implementation: swapRouter.address,
      },
    },
    hre
  );

  if (verify_contracts) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: swapRouter.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: swapRouterProxy.address,
      constructorArguments: [swapRouter.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: swapRouter, proxy: swapRouterProxy};
}
