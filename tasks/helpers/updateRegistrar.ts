import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {AngelCoreStruct} from "typechain-types/contracts/core/registrar/registrar.sol/Registrar";
import {getSigners, logger, structToObject} from "utils";

export async function updateRegistrarNetworkConnections(
  registrar: string,
  apTeamMultisig: string,
  newNetworkInfo: Partial<AngelCoreStruct.NetworkInfoStructOutput>,
  hre: HardhatRuntimeEnvironment
) {
  logger.divider();
  logger.out("Updating Registrar config...");

  try {
    const network = await hre.ethers.provider.getNetwork();

    const {apTeamMultisigOwners} = await getSigners(hre);

    const registrarContract = Registrar__factory.connect(registrar, apTeamMultisigOwners[0]);

    logger.out("Fetching current Registrar's network connection data...");
    const struct = await registrarContract.queryNetworkConnection(network.chainId);
    const curNetworkConnection = structToObject(struct);
    logger.out(curNetworkConnection);

    logger.out("Network info to update:");
    logger.out(newNetworkInfo);

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
      "Registrar: Update Network Connections",
      registrar,
      0,
      updateNetworkConnectionsData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    logger.out("Updated network connection data:");
    const newStruct = await registrarContract.queryNetworkConnection(network.chainId);
    const newNetworkConnection = structToObject(newStruct);
    logger.out(newNetworkConnection);
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}

export async function updateRegistrarConfig(
  registrar: string,
  apTeamMultisig: string,
  updateConfigRequest: Partial<RegistrarMessages.UpdateConfigRequestStruct>,
  hre: HardhatRuntimeEnvironment
) {
  try {
    logger.divider();
    logger.out("Updating Registrar config with new addresses...");

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
        splitDefault: splitToLiquid.defaultSplit,
        splitMin: splitToLiquid.min,
        splitMax: splitToLiquid.max,
        approved_charities: [],
        ...updateConfigRequest,
      },
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      apTeamMultisig,
      apTeamMultisigOwners[0]
    );
    const tx = await apTeamMultisigContract.submitTransaction(
      "Registrar: Update Config",
      "Registrar: Update Config",
      registrar,
      0,
      updateConfigData,
      "0x"
    );
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