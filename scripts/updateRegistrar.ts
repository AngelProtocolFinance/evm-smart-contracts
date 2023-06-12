import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {AngelCoreStruct} from "typechain-types/contracts/core/registrar/registrar.sol/Registrar";
import {getSigners, logger} from "utils";

export async function updateRegistrarNetworkConnections(
  registrar: string,
  apTeamMultisig: string,
  newNetworkInfo: Partial<AngelCoreStruct.NetworkInfoStructOutput>,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const network = await hre.ethers.provider.getNetwork();
    logger.out(`Updating Registrar network connection for chain ID:${network.chainId}...`);

    const {apTeamMultisigOwners} = await getSigners(hre);

    const registrarContract = Registrar__factory.connect(registrar, apTeamMultisigOwners[0]);

    logger.out("Fetching current Registrar's network connection data...");
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
      "Registrar: Update Network Connections",
      registrar,
      0,
      updateNetworkConnectionsData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    logger.out("Successfully updated network connections.");
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
    logger.out("Updating Registrar config with new addresses...");

    const {apTeamMultisigOwners} = await getSigners(hre);

    const registrarContract = Registrar__factory.connect(registrar, apTeamMultisigOwners[0]);

    logger.out("Fetching current Registrar's config...");
    const {splitToLiquid, ...curConfig} = await registrarContract.queryConfig();
    logger.out(JSON.stringify(curConfig, undefined, 2));

    logger.out(`Config data to update:\n${JSON.stringify(updateConfigRequest, undefined, 2)}`);

    const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
      {
        ...curConfig,
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

    logger.out("Successfully updated config.");
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
