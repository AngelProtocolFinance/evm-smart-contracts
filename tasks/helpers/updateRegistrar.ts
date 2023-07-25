import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {
  IAccountsStrategy,
  RegistrarMessages,
} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {
  NetworkConnectionAction,
  getChainId,
  getNetworkNameFromChainId,
  getSigners,
  logger,
  structToObject,
  validateAddress,
} from "utils";

export async function updateRegistrarNetworkConnections(
  registrar = "",
  apTeamMultisig = "",
  networkInfo: Partial<IAccountsStrategy.NetworkInfoStruct>,
  hre: HardhatRuntimeEnvironment
) {
  logger.divider();

  let networkName
  try {

    // If we're updating info on this chain for another chain, arg info MUST specify chain id 
    if (Number(networkInfo.chainId) > 0) {
      networkName = getNetworkNameFromChainId(Number(networkInfo.chainId));
    }
    else { // we're updating this chains own network info and can safely lookup chain id
      const chainId = await getChainId(hre);
      networkName = getNetworkNameFromChainId(chainId);
    }

    logger.out(`Updating Registrar network info for chain: ${networkName}`);

    validateAddress(registrar, "registrar");
    validateAddress(apTeamMultisig, "apTeamMultisig");

    const {apTeamMultisigOwners} = await getSigners(hre);

    const registrarContract = Registrar__factory.connect(registrar, apTeamMultisigOwners[0]);

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
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      apTeamMultisig,
      apTeamMultisigOwners[0]
    );
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

export async function updateRegistrarConfig(
  registrar = "",
  apTeamMultisig = "",
  updateConfigRequest: Partial<RegistrarMessages.UpdateConfigRequestStruct>,
  hre: HardhatRuntimeEnvironment
) {
  try {
    logger.divider();
    logger.out("Updating Registrar config with new addresses...");

    validateAddress(registrar, "registrar");
    validateAddress(apTeamMultisig, "apTeamMultisig");

    const {apTeamMultisigOwners} = await getSigners(hre);

    const registrarContract = Registrar__factory.connect(registrar, apTeamMultisigOwners[0]);

    logger.out("Fetching current Registrar's config...");
    const struct = await registrarContract.queryConfig();
    const curConfig = structToObject(struct);
    logger.out(curConfig);

    logger.out("Config data to update:");
    logger.out(updateConfigRequest);

    const {splitToLiquid, ...otherConfig} = curConfig;
    const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
      {
        ...otherConfig,
        splitMax: splitToLiquid.max,
        splitMin: splitToLiquid.min,
        splitDefault: splitToLiquid.defaultSplit,
        ...updateConfigRequest,
      },
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      apTeamMultisig,
      apTeamMultisigOwners[0]
    );
    const tx = await apTeamMultisigContract.submitTransaction(registrar, 0, updateConfigData, "0x");
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    logger.out("New config:");
    const newStruct = await registrarContract.queryConfig();
    const newConfig = structToObject(newStruct);
    logger.out(newConfig);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
