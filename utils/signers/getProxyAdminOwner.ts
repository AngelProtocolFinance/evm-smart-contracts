import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {connectSignerFromPkey} from "./connectSignerFromPkey";
import {getSigners} from "./getSigners";

export async function getProxyAdminOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<Signer> {
  if (pkey) {
    return await connectSignerFromPkey(pkey, hre);
  }

  const {proxyAdminMultisigOwners} = await getSigners(hre);

  if (!proxyAdminMultisigOwners || proxyAdminMultisigOwners.length === 0) {
    throw new Error("Must provide a pkey for ProxyAdminMultiSig owner on this network");
  }
  return proxyAdminMultisigOwners[0];
}
