import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, SwapRouter__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deploySwapRouter(
  registrarContract: string,
  accountsContract: string,
  swapFactory: string,
  swapRouterAddress: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying SwapRouter...");

  const {proxyAdmin} = await getSigners(hre.ethers);

  // deploy implementation
  const swapRouterFactory = new SwapRouter__factory(proxyAdmin);
  const swapRouter = await swapRouterFactory.deploy();
  await swapRouter.deployed();
  logger.out(`Implementation deployed at: ${swapRouter.address}`);

  // deploy proxy
  const initData = swapRouter.interface.encodeFunctionData("initSwapRouter", [
    {
      registrarContract,
      accountsContract,
      swapFactory,
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
  logger.out(`Proxy deployed at: ${swapRouterProxy.address}`);

  // update contract-address.json
  await updateAddresses(
    {
      swapRouter: {
        implementation: swapRouter.address,
        proxy: swapRouterProxy.address,
      },
    },
    hre
  );

  // verify contracts
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
