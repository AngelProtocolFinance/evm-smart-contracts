import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {connectSignerFromPkey} from "./connectSignerFromPkey";
import {getSigners} from "./getSigners";
import { Wallet } from "ethers";

export async function getAPTeamOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress|Wallet> {
  if (pkey) {
    return await connectSignerFromPkey(pkey, hre);
  }

  const {apTeamMultisigOwners} = await getSigners(hre);

  if (!apTeamMultisigOwners || apTeamMultisigOwners.length === 0) {
    throw new Error("Must provide a pkey for APTeamMultiSig owner on this network");
  }
  return apTeamMultisigOwners[0];
}
