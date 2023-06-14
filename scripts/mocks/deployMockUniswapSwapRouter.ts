import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger, updateAddresses} from "utils";

export async function deployMockUniswapSwapRouter(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<string> {
  // just use some placeholder address until actual mock deployment is created
  // TODO: create a real mock contract for the swap router
  logger.out("Deploying mock Uniswap SwapRouter...");
  const address = admin.address;
  logger.out(`Address: ${address}`);

  await updateAddresses({uniswapSwapRouter: address}, hre);

  return address;
}
