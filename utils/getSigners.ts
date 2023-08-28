import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Wallet} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {isProdNetwork} from "./networkHelpers";

type Result = {
  airdropOwner?: SignerWithAddress;
  apTeam1: SignerWithAddress;
  apTeam2: SignerWithAddress;
  apTeam3: SignerWithAddress;
  charityApplicationsOwners?: SignerWithAddress[];
  apTeamMultisigOwners?: SignerWithAddress[];
  deployer: SignerWithAddress;
  proxyAdminSigner?: SignerWithAddress;
  timeLockAdmin?: SignerWithAddress;
  treasury?: SignerWithAddress;
};

export async function getSigners(hre: HardhatRuntimeEnvironment): Promise<Result> {
  if (await isProdNetwork(hre)) {
    const [deployer, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners();
    return {
      deployer,
      apTeam1,
      apTeam2,
      apTeam3,
    };
  } else {
    const [deployer, proxyAdminSigner, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners();

    return {
      airdropOwner: apTeam1,
      apTeam1,
      apTeam2,
      apTeam3,
      charityApplicationsOwners: [apTeam2, apTeam3],
      apTeamMultisigOwners: [apTeam1, apTeam2],
      deployer,
      proxyAdminSigner,
      treasury: apTeam1,
      timeLockAdmin: apTeam1,
    };
  }
}

export async function connectSignerFromPkey(
  pkey: string,
  hre: HardhatRuntimeEnvironment
): Promise<SignerWithAddress> {
  const signer = new Wallet(pkey, hre.ethers.provider);
  return hre.ethers.getSigner(signer.address);
}
