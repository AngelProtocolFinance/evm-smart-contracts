import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";

type Result = {
  apTeam1: SignerWithAddress;
  apTeam2: SignerWithAddress;
  apTeam3: SignerWithAddress;
  applicationsMultisigOwners: SignerWithAddress[];
  apTeamMultisigOwners: SignerWithAddress[];
  deployer: SignerWithAddress;
  proxyAdmin: SignerWithAddress;
  timeLockAdmin: SignerWithAddress;
  treasuryAdmin: SignerWithAddress;
};

export async function getSigners(ethers: HardhatRuntimeEnvironment["ethers"]): Promise<Result> {
  const [deployer, proxyAdmin, apTeam1, apTeam2, apTeam3] = await ethers.getSigners();

  return {
    deployer,
    proxyAdmin,
    apTeam1,
    apTeam2,
    apTeam3,
    applicationsMultisigOwners: [apTeam2, apTeam3],
    apTeamMultisigOwners: [apTeam1, apTeam2],
    treasuryAdmin: apTeam1,
    timeLockAdmin: apTeam1,
  };
}
