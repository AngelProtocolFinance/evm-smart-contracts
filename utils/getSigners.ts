import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

type Result = {
  airdropOwner: SignerWithAddress;
  apTeam1: SignerWithAddress;
  apTeam2: SignerWithAddress;
  apTeam3: SignerWithAddress;
  charityApplicationsOwners: SignerWithAddress[];
  apTeamMultisigOwners: SignerWithAddress[];
  deployer: SignerWithAddress;
  proxyAdmin: SignerWithAddress;
  timeLockAdmin: SignerWithAddress;
  treasury: SignerWithAddress;
};

export async function getSigners(hre: HardhatRuntimeEnvironment): Promise<Result> {
  const [deployer, proxyAdmin, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners();

  return {
    airdropOwner: apTeam1,
    apTeam1,
    apTeam2,
    apTeam3,
    charityApplicationsOwners: [apTeam2, apTeam3],
    apTeamMultisigOwners: [apTeam1, apTeam2],
    deployer,
    proxyAdmin,
    treasury: apTeam1,
    timeLockAdmin: apTeam1,
  };
}
