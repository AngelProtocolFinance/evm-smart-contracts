import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Wallet} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export async function connectSignerFromPkey(
  pkey: string,
  hre: HardhatRuntimeEnvironment
): Promise<SignerWithAddress> {
  const signer = new Wallet(pkey, hre.ethers.provider);
  return hre.ethers.getSigner(signer.address);
}
