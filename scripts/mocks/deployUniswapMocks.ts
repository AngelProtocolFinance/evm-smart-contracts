import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger, updateAddresses} from "utils";

export async function deployUniswapMocks(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{factory: string; swapRouter: string}> {
  // just use some placeholder address until actual mock deployment is created
  // TODO: create a real mock contract for the swap router
  const address = admin.address;

  logger.out("Deploying mock Uniswap Factory...");
  logger.out(`Address: ${address}`);

  logger.out("Deploying mock Uniswap SwapRouter...");
  logger.out(`Address: ${address}`);

  await updateAddresses(
    {
      uniswap: {
        factory: address,
        swapRouter: address,
      },
    },
    hre
  );

  return {factory: address, swapRouter: address};
}
