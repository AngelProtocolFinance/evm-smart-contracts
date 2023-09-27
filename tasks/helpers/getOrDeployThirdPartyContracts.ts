import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  ERC20,
  ERC20__factory,
  IAxelarGasService,
  IAxelarGasService__factory,
  IAxelarGateway,
  IAxelarGateway__factory,
  ISwapRouter,
  ISwapRouter__factory,
  IUniswapV3Factory,
  IUniswapV3Factory__factory,
} from "typechain-types";
import {getAddresses, isLocalNetwork, logger, updateAddresses} from "utils";
import {
  deployDummyERC20,
  deployDummyGasService,
  deployDummyGateway,
  deployDummyUniswap,
} from "./deploy";

type Result = {
  axelarGasService: IAxelarGasService;
  axelarGateway: IAxelarGateway;
  seedAsset: ERC20;
  uniswap: {
    factory: IUniswapV3Factory;
    swapRouter: ISwapRouter;
  };
  usdcToken: ERC20;
  wmaticToken: ERC20;
};

export async function getOrDeployThirdPartyContracts(
  signer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<Result> {
  logger.out("Getting 3rd party contracts...");

  if (isLocalNetwork(hre)) {
    const result: Result = {
      axelarGasService: await deployDummyGasService(signer),
      axelarGateway: await deployDummyGateway(signer),
      uniswap: await deployDummyUniswap(signer),
      seedAsset: await deployDummyERC20(signer, [await signer.getAddress()], [100]),
      usdcToken: await deployDummyERC20(signer, [await signer.getAddress()], [100], 6),
      wmaticToken: await deployDummyERC20(signer, [await signer.getAddress()], [1]),
    };

    await updateAddresses(
      {
        axelar: {
          gasService: result.axelarGasService.address,
          gateway: result.axelarGateway.address,
        },
        uniswap: {
          factory: result.uniswap.factory.address,
          swapRouter: result.uniswap.swapRouter.address,
        },
        tokens: {
          seedAsset: result.seedAsset.address,
          usdc: result.usdcToken.address,
          wmatic: result.wmaticToken.address,
        },
      },
      hre
    );

    return result;
  }

  const addresses = await getAddresses(hre);

  // will fail if any of the addresses are not set
  return {
    axelarGasService: IAxelarGasService__factory.connect(addresses.axelar.gasService, signer),
    axelarGateway: IAxelarGateway__factory.connect(addresses.axelar.gateway, signer),
    seedAsset: ERC20__factory.connect(addresses.tokens.seedAsset, signer),
    uniswap: {
      factory: IUniswapV3Factory__factory.connect(addresses.uniswap.factory, signer),
      swapRouter: ISwapRouter__factory.connect(addresses.uniswap.swapRouter, signer),
    },
    usdcToken: ERC20__factory.connect(addresses.tokens.usdc, signer),
    wmaticToken: ERC20__factory.connect(addresses.tokens.wmatic, signer),
  };
}
