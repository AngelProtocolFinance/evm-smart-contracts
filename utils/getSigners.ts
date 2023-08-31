import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Wallet} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyAdminMultiSig__factory} from "typechain-types";
import {getContractName} from "./getContractName";
import {getAddresses} from "./manageAddressFile";
import {isProdNetwork} from "./networkHelpers";

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

const ProxyAdminMultiSigName = getContractName(new ProxyAdminMultiSig__factory());
const APTeamMultiSigName = getContractName(new APTeamMultiSig__factory());

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

export async function connectSignerFromPkey(
  pkey: string,
  hre: HardhatRuntimeEnvironment
): Promise<SignerWithAddress> {
  const signer = new Wallet(pkey, hre.ethers.provider);
  return hre.ethers.getSigner(signer.address);
}

const PAM_ERROR = new Error(
  `Must provide a pkey for ${ProxyAdminMultiSigName} owner on this network`
);
export async function getProxyAdminOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress> {
  if (!pkey) {
    const {proxyAdminMultisigOwners} = await getSigners(hre);
    if (!proxyAdminMultisigOwners || proxyAdminMultisigOwners.length === 0) {
      throw PAM_ERROR;
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
    throw PAM_ERROR;
  }

  return signer;
}

const APTM_ERROR = new Error(`Must provide a pkey for ${APTeamMultiSigName} owner on this network`);
export async function getAPTeamOwner(
  hre: HardhatRuntimeEnvironment,
  pkey?: string
): Promise<SignerWithAddress> {
  if (!pkey) {
    const {apTeamMultisigOwners} = await getSigners(hre);
    if (!apTeamMultisigOwners || apTeamMultisigOwners.length === 0) {
      throw APTM_ERROR;
    }
    return apTeamMultisigOwners[0];
  }

  const signer = await connectSignerFromPkey(pkey, hre);
  const addresses = await getAddresses(hre);

  const apTeamMultiSig = APTeamMultiSig__factory.connect(
    addresses.multiSig.apTeam.proxy,
    hre.ethers.provider
  );
  const isOwner = await apTeamMultiSig.isOwner(signer.address);
  if (!isOwner) {
    throw APTM_ERROR;
  }

  return signer;
}
