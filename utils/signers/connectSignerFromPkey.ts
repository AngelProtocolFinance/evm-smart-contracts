import {Wallet} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function connectSignerFromPkey(
  pkey: string,
  hre: HardhatRuntimeEnvironment
): Promise<Wallet> {
  return new Wallet(pkey, hre.ethers.provider);
}
