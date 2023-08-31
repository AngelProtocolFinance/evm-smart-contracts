import {task, types} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {
  AddressObj,
  NetworkConnectionAction,
  getAPTeamOwner,
  getAddresses,
  getAddressesByNetworkId,
  getAxlNetworkName,
  getChainIdFromNetworkName,
  getNetworkNameFromChainId,
  logger,
  structToObject,
} from "utils";

type TaskArgs = {
  chainId: number;
  refundAddr?: string;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task("manage:registrar:updateNetworkConnections")
  .addOptionalParam("chainId", "Chain ID of the network connection to update.", 0, types.int)
  .addOptionalParam("refundAddr", "Refund address.")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out(`Updating Registrar network info...`);
      const addresses = await getAddresses(hre);

      let networkName: string;
      let targetAddresses: AddressObj;
      // If we're updating info on this chain for another chain, arg info MUST specify chain id
      if (taskArgs.chainId > 0) {
        networkName = getNetworkNameFromChainId(taskArgs.chainId);
        targetAddresses = getAddressesByNetworkId(taskArgs.chainId);
      } else {
        // we're updating this chains own network info and can safely lookup chain id
        networkName = await getAxlNetworkName(hre);
        targetAddresses = addresses;
      }

      logger.out(
        `Fetching current Registrar's network connection data for chain: ${networkName}...`
      );

      const registrar = Registrar__factory.connect(addresses.registrar.proxy, hre.ethers.provider);
      const struct = await registrar.queryNetworkConnection(networkName);
      const curNetworkConnection = structToObject(struct);
      logger.out(JSON.stringify(curNetworkConnection, undefined, 2));

      const newNetworkConnection: LocalRegistrarLib.NetworkInfoStruct = {
        axelarGateway: targetAddresses.axelar.gateway,
        chainId: getChainIdFromNetworkName(networkName),
        gasReceiver: targetAddresses.axelar.gasService,
        router: targetAddresses.router.proxy,
        refundAddr: taskArgs.refundAddr ?? curNetworkConnection.refundAddr,
      };
      logger.out("New network connection values:");
      logger.out(newNetworkConnection);

      logger.out("Submitting Tx to APTeamMultiSig...");
      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const apTeamMultisigContract = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner
      );
      const updateNetworkConnectionsData = registrar.interface.encodeFunctionData(
        "updateNetworkConnections",
        [networkName, newNetworkConnection, NetworkConnectionAction.POST]
      );
      const tx = await apTeamMultisigContract.submitTransaction(
        registrar.address,
        0,
        updateNetworkConnectionsData,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      logger.out("Updated network connection data:");
      const newStruct = await registrar.queryNetworkConnection(networkName);
      logger.out(JSON.stringify(structToObject(newStruct), undefined, 2));
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
