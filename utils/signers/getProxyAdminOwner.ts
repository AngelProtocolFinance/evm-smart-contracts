import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyAdminMultiSig__factory} from "typechain-types";
import {getContractName} from "../getContractName";
import {getAddresses} from "../manageAddressFile";
import {connectSignerFromPkey} from "./connectSignerFromPkey";
import {getSigners} from "./getSigners";

export async function getProxyAdminOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress> {
  const msName = getContractName(new ProxyAdminMultiSig__factory());
  const error = new Error(`Must provide a pkey for ${msName} owner on this network`);

  if (!pkey) {
    const {proxyAdminMultisigOwners} = await getSigners(hre);
    if (!proxyAdminMultisigOwners || proxyAdminMultisigOwners.length === 0) {
      throw error;
    }
    return proxyAdminMultisigOwners[0];
  }

  const signer = await connectSignerFromPkey(pkey, hre);
  const addresses = await getAddresses(hre);

  const proxyAdminMultiSig = ProxyAdminMultiSig__factory.connect(
    addresses.multiSig.proxyAdmin,
    hre.ethers.provider
  );
  const isOwner = await proxyAdminMultiSig.isOwner(signer.address);
  if (!isOwner) {
    throw error;
  }

  return signer;
}
