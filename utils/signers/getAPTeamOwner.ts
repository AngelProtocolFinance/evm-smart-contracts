import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
// import {APTeamMultiSig__factory} from "typechain-types";
import {getContractName} from "../getContractName";
import {getAddresses} from "../manageAddressFile";
import {connectSignerFromPkey} from "./connectSignerFromPkey";
import {getSigners} from "./getSigners";

export async function getAPTeamOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress> {
  // const msName = getContractName(new APTeamMultiSig__factory());
  const error = new Error(`Must provide a pkey for ${"msName"} owner on this network`);
  if (!pkey) {
    const {apTeamMultisigOwners} = await getSigners(hre);
    if (!apTeamMultisigOwners || apTeamMultisigOwners.length === 0) {
      throw error;
    }
    return apTeamMultisigOwners[0];
  }

  const signer = await connectSignerFromPkey(pkey, hre);
  const addresses = await getAddresses(hre);

  // const apTeamMultiSig = APTeamMultiSig__factory.connect(
  //   addresses.multiSig.apTeam.proxy,
  //   hre.ethers.provider
  // );
  // const isOwner = await apTeamMultiSig.isOwner(signer.address);
  // if (!isOwner) {
  //   throw error;
  // }

  return signer;
}
