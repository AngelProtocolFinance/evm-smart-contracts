import {Signer, Wallet} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function connectSignerFromPkey(
  pkey: string,
  hre: HardhatRuntimeEnvironment
): Promise<Signer> {
  return new Wallet(pkey, hre.ethers.provider);
}
