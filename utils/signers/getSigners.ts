import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {isProdNetwork} from "../networkHelpers";

type Result = {
  airdropOwner?: Signer;
  apTeam1: Signer;
  apTeam2: Signer;
  apTeam3: Signer;
  charityApplicationsOwners?: Signer[];
  apTeamMultisigOwners?: Signer[];
  proxyAdminMultisigOwners?: Signer[];
  deployer: Signer;
  timeLockAdmin?: Signer;
  treasury?: Signer;
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
    const [deployer, proxyAdminOwner, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners();
    return {
      airdropOwner: apTeam1,
      apTeam1,
      apTeam2,
      apTeam3,
      charityApplicationsOwners: [apTeam2, apTeam3],
      apTeamMultisigOwners: [apTeam1, apTeam2],
      proxyAdminMultisigOwners: [proxyAdminOwner],
      deployer,
      treasury: apTeam1,
      timeLockAdmin: apTeam1,
    };
  }
}
