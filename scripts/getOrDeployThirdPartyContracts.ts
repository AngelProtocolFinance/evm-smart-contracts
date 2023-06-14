import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getAddresses, isLocalNetwork} from "utils";
import {deployMockERC20, deployMockUSDC, deployMockUniswapSwapRouter} from "./mocks";

type Result = {
  uniswapSwapRouter: string;
  usdcToken: string;
  wmaticToken: string;
  axelarGateway: string;
  axelarGasRecv: string;
  seedAsset: string;
};

export default async function getOrDeployThirdPartyContracts(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Result> {
  if (isLocalNetwork(hre)) {
    return {
      uniswapSwapRouter: await deployMockUniswapSwapRouter(admin, hre),
      usdcToken: await deployMockUSDC(admin, hre),
      wmaticToken: await deployMockERC20("WMatic", "WMatic", admin, hre),
      axelarGateway: await deployMockContract(admin, hre),
      axelarGasRecv: await deployMockContract(admin, hre),
      seedAsset: await deployMockContract(admin, hre),
    };
  }

  const addresses = await getAddresses(hre);

  return {
    uniswapSwapRouter: addresses.uniswapSwapRouter,
    usdcToken: addresses.tokens.usdc,
    wmaticToken: addresses.tokens.wmatic,
    axelarGateway: addresses.axelar.gateway,
    axelarGasRecv: addresses.axelar.gasRecv,
    seedAsset: addresses.seedAsset,
  };
}

/**
 * Placeholder function until real mock deploy functions are created
 */
async function deployMockContract(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<string> {
  return await deployMockUniswapSwapRouter(admin, hre);
}
