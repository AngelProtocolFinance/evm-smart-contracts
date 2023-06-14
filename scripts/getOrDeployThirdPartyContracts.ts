import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getAddresses, isLocalNetwork} from "utils";
import {deployMockERC20, deployMockUSDC, deployUniswapMocks} from "./mocks";

type Result = {
  uniswap: {
    factory: string;
    swapRouter: string;
  };
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
      axelarGasRecv: await deployMockContract(admin, hre),
      axelarGateway: await deployMockContract(admin, hre),
      seedAsset: await deployMockContract(admin, hre),
      uniswap: await deployUniswapMocks(admin, hre),
      usdcToken: await deployMockUSDC(admin, hre),
      wmaticToken: await deployMockERC20("WMatic", "WMatic", admin, hre),
    };
  }

  const addresses = await getAddresses(hre);

  return {
    axelarGasRecv: addresses.axelar.gasRecv,
    axelarGateway: addresses.axelar.gateway,
    seedAsset: addresses.seedAsset,
    uniswap: {
      factory: addresses.uniswap.factory,
      swapRouter: addresses.uniswap.swapRouter,
    },
    usdcToken: addresses.tokens.usdc,
    wmaticToken: addresses.tokens.wmatic,
  };
}

/**
 * Placeholder function until real mock deploy functions are created
 */
async function deployMockContract(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<string> {
  return (await deployUniswapMocks(admin, hre)).factory;
}
