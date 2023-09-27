import {Signer} from "ethers";
import {
  DummySwapRouter__factory,
  DummyUniswapV3Factory__factory,
  ISwapRouter,
  ISwapRouter__factory,
  IUniswapV3Factory,
  IUniswapV3Factory__factory,
} from "typechain-types";
import {deploy} from "utils";

export async function deployDummyUniswap(signer: Signer): Promise<{
  factory: IUniswapV3Factory;
  swapRouter: ISwapRouter;
}> {
  const factory = await deploy(new DummyUniswapV3Factory__factory(signer));
  const swapRouter = await deploy(new DummySwapRouter__factory(signer));

  return {
    factory: IUniswapV3Factory__factory.connect(factory.contract.address, signer),
    swapRouter: ISwapRouter__factory.connect(swapRouter.contract.address, signer),
  };
}
