import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {isProdNetwork} from "../networkHelpers";

type Result = {
  airdropOwner?: SignerWithAddress;
  apTeam1: SignerWithAddress;
  apTeam2: SignerWithAddress;
  apTeam3: SignerWithAddress;
  charityApplicationsOwners?: SignerWithAddress[];
  apTeamMultisigOwners?: SignerWithAddress[];
  proxyAdminMultisigOwners?: SignerWithAddress[];
  deployer: SignerWithAddress;
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
