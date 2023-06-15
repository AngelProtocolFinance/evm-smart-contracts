import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  DummyGasService,
  DummyGateway,
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
import {
  deployDummyERC20,
  deployDummyGasService,
  deployDummyGateway,
  deployDummyUniswap,
  getAddresses,
  isLocalNetwork,
  updateAddresses,
} from "utils";

type Result = {
  axelarGasRecv: DummyGasService | IAxelarGasService;
  axelarGateway: DummyGateway | IAxelarGateway;
  seedAsset: ERC20;
  uniswap: {
    factory: IUniswapV3Factory;
    swapRouter: ISwapRouter;
  };
  usdcToken: ERC20;
  wmaticToken: ERC20;
};

export default async function getOrDeployThirdPartyContracts(
  signer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Result> {
  if (isLocalNetwork(hre)) {
    const result = {
      axelarGasRecv: await deployDummyGasService(signer),
      axelarGateway: await deployDummyGateway(signer),
      seedAsset: await deployDummyERC20(signer, [signer.address], [100]),
      uniswap: await deployDummyUniswap(signer, hre),
      usdcToken: await deployDummyERC20(signer, [signer.address], [100]),
      wmaticToken: await deployDummyERC20(signer, [signer.address], [1]),
    };

    await updateAddresses(
      {
        axelar: {gasRecv: result.axelarGasRecv.address, gateway: result.axelarGateway.address},
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

  return {
    axelarGasRecv: IAxelarGasService__factory.connect(addresses.axelar.gasRecv, signer),
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
