import {CONFIG} from "config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory} from "typechain-types";
import {ProxyDeployment, deployBehindProxy, getSigners, updateAddresses} from "utils";

export async function deployAPTeamMultiSig(
  proxyAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<APTeamMultiSig__factory>> {
  const {apTeamMultisigOwners} = await getSigners(hre);
  const owners = apTeamMultisigOwners
    ? apTeamMultisigOwners.map((x) => x.address)
    : CONFIG.PROD_CONFIG.APTeamMultiSigOwners;

  // data setup
  const APTeamMultiSig = new APTeamMultiSig__factory(deployer);
  const data = APTeamMultiSig.interface.encodeFunctionData("initializeAPTeam", [
    owners,
    CONFIG.AP_TEAM_MULTISIG_DATA.threshold,
    CONFIG.AP_TEAM_MULTISIG_DATA.requireExecution,
    CONFIG.AP_TEAM_MULTISIG_DATA.transactionExpiry,
  ]);
  // deploy
  const {implementation, proxy} = await deployBehindProxy(APTeamMultiSig, proxyAdmin, data);

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
