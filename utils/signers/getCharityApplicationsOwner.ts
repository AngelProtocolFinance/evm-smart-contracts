import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {connectSignerFromPkey} from "./connectSignerFromPkey";
import {getSigners} from "./getSigners";

export async function getCharityApplicationsOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress> {
  if (pkey) {
    return await connectSignerFromPkey(pkey, hre);
  }

  const {charityApplicationsOwners} = await getSigners(hre);

  if (!charityApplicationsOwners || charityApplicationsOwners.length === 0) {
    throw new Error("Must provide a pkey for CharityApplications owner on this network");
  }
  return charityApplicationsOwners[0];
}
