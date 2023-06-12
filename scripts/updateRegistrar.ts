import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {AngelCoreStruct} from "typechain-types/contracts/core/registrar/registrar.sol/Registrar";
import {getSigners, logger} from "utils";

export async function updateRegistrarNetworkConnection(
  registrar: string,
  newNetworkInfo: AngelCoreStruct.NetworkInfoStructOutput,
  apTeamMultisig: string,
  hre: HardhatRuntimeEnvironment
) {
  logger.out(`Updating Registrar network connection...`);
  logger.out(`New network info:\n${JSON.stringify(newNetworkInfo, undefined, 2)}`);

  const {proxyAdmin, apTeamMultisigOwners} = await getSigners(hre);

  const registrarContract = Registrar__factory.connect(registrar, proxyAdmin);
  const updateNetworkConnectionsData = registrarContract.interface.encodeFunctionData(
    "updateNetworkConnections",
    [newNetworkInfo, "post"]
  );
  const apTeamMultisigContract = APTeamMultiSig__factory.connect(
    apTeamMultisig,
    apTeamMultisigOwners[0]
  );
  const tx = await apTeamMultisigContract.submitTransaction(
    "Registrar: Update Network Connections",
    "",
    registrar,
    0,
    updateNetworkConnectionsData,
    "0x"
  );
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
}
