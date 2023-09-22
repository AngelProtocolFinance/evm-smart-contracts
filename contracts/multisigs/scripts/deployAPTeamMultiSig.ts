import {CONFIG} from "config";
import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, getSigners, updateAddresses} from "utils";

export async function deployAPTeamMultiSig(
  proxyAdmin: string,
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<APTeamMultiSig__factory>> {
  const {apTeamMultisigOwners} = await getSigners(hre);
  const owners = apTeamMultisigOwners
    ? await Promise.all(apTeamMultisigOwners.map((x) => x.getAddress()))
    : CONFIG.PROD_CONFIG.APTeamMultiSigOwners;

  // data setup
  const data = APTeamMultiSig__factory.createInterface().encodeFunctionData("initializeAPTeam", [
    owners,
    CONFIG.AP_TEAM_MULTISIG_DATA.threshold,
    CONFIG.AP_TEAM_MULTISIG_DATA.requireExecution,
    CONFIG.AP_TEAM_MULTISIG_DATA.transactionExpiry,
  ]);
  // deploy
  const {implementation, proxy} = await deployBehindProxy(
    new APTeamMultiSig__factory(deployer),
    proxyAdmin,
    data
  );

  // update address file
  await updateAddresses(
    {
      multiSig: {
        apTeam: {
          implementation: implementation.contract.address,
          proxy: proxy.contract.address,
        },
      },
    },
    hre
  );

  return {implementation, proxy};
}
