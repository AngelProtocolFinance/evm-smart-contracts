import {HardhatRuntimeEnvironment} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {
  NetworkConnectionAction,
  getAxlNetworkName,
  getNetworkNameFromChainId,
  logger,
  structToObject,
  validateAddress,
} from "utils";

export async function updateRegistrarNetworkConnections(
  registrar = "",
  apTeamMultisig = "",
  networkInfo: Partial<LocalRegistrarLib.NetworkInfoStruct>,
  signer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  logger.divider();

  let networkName;
  try {
    // If we're updating info on this chain for another chain, arg info MUST specify chain id
    if (Number(networkInfo.chainId) > 0) {
      networkName = getNetworkNameFromChainId(Number(networkInfo.chainId));
    } else {
      // we're updating this chains own network info and can safely lookup chain id
      networkName = await getAxlNetworkName(hre);
    }

    logger.out(`Updating Registrar network info for chain: ${networkName}`);

    validateAddress(registrar, "registrar");
    validateAddress(apTeamMultisig, "apTeamMultisig");

    const registrarContract = Registrar__factory.connect(registrar, signer);

    logger.out("Fetching current Registrar's network connection data...");

    const struct = await registrarContract.queryNetworkConnection(networkName);
    const curNetworkConnection = structToObject(struct);
    logger.out(curNetworkConnection);

    logger.out("Network info to update:");
    logger.out(networkInfo);

    const updateNetworkConnectionsData = registrarContract.interface.encodeFunctionData(
      "updateNetworkConnections",
      [networkName, {...curNetworkConnection, ...networkInfo}, NetworkConnectionAction.POST]
    );
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(apTeamMultisig, signer);
    const tx = await apTeamMultisigContract.submitTransaction(
      registrarContract.address,
      0,
      updateNetworkConnectionsData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    logger.out("Updated network connection data:");
    const newStruct = await registrarContract.queryNetworkConnection(networkName);
    const newNetworkConnection = structToObject(newStruct);
    logger.out(newNetworkConnection);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
