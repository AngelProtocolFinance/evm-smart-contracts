import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  ISwapRouter,
  ISwapRouter__factory,
  IUniswapV3Factory,
  IUniswapV3Factory__factory,
} from "typechain-types";
import {logger} from "utils";

export async function deployDummyUniswap(
  signer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<{factory: IUniswapV3Factory; swapRouter: ISwapRouter}> {
  // just use some placeholder address until actual mock deployment is created
  // TODO: create a real mock contract for the swap router
  const address = await signer.getAddress();

  logger.out("Deploying dummy Uniswap Factory...");
  logger.out(`Address: ${address}`);

  logger.out("Deploying dummy Uniswap SwapRouter...");
  logger.out(`Address: ${address}`);

  return {
    factory: IUniswapV3Factory__factory.connect(address, signer),
    swapRouter: ISwapRouter__factory.connect(address, signer),
  };
}
