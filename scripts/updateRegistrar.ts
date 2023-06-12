import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {AngelCoreStruct} from "typechain-types/contracts/core/registrar/registrar.sol/Registrar";
import {getSigners, logger} from "utils";

export async function updateRegistrarNetworkConnections(
  registrar: string,
  apTeamMultisig: string,
  newNetworkInfo: Partial<AngelCoreStruct.NetworkInfoStructOutput>,
  hre: HardhatRuntimeEnvironment
) {
  const network = await hre.ethers.provider.getNetwork();
  logger.out(`Updating Registrar network connection for chain ID:${network.chainId}...`);

  const {proxyAdmin, apTeamMultisigOwners} = await getSigners(hre);

  const registrarContract = Registrar__factory.connect(registrar, proxyAdmin);
  logger.out(`Fetching current Registrar's network connection data...`);
  const curNetworkConnection = await registrarContract.queryNetworkConnection(network.chainId);
  logger.out(JSON.stringify(curNetworkConnection, undefined, 2));

  logger.out(`Network info to update:\n${JSON.stringify(newNetworkInfo, undefined, 2)}`);

  const updateNetworkConnectionsData = registrarContract.interface.encodeFunctionData(
    "updateNetworkConnections",
    [{...curNetworkConnection, ...newNetworkInfo}, "post"]
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

  logger.out("Done.");
}
