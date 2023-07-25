import {task, types} from "hardhat/config";
import {IAccountsStrategy} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {updateRegistrarNetworkConnections} from "tasks/helpers";
import {
  getAddresses,
  logger,
  getAddressesByNetworkId,
  getChainIdFromNetworkName,
  DEFAULT_CONTRACT_ADDRESS_FILE_PATH,
} from "utils";

type TaskArgs = {
  networkName: string;
};

task("manage:registrar:setNetworkInfo", "Set network info for a specified network")
  .addParam(
    "networkName",
    "The name of the network using Axelars naming convention",
    "",
    types.string
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");

    const networkId = getChainIdFromNetworkName(taskArguments.networkName);
    const thisNetworkAddresses = await getAddresses(hre)
    const thatNetworkAddresses = getAddressesByNetworkId(networkId, DEFAULT_CONTRACT_ADDRESS_FILE_PATH);
    const newNetworkInfo: Partial<IAccountsStrategy.NetworkInfoStruct> = {
      chainId: networkId,
      router: thatNetworkAddresses.router.proxy,
      axelarGateway: thatNetworkAddresses.axelar.gateway,
      gasReceiver: thatNetworkAddresses.axelar.gasService,
    };

    await updateRegistrarNetworkConnections(
      thisNetworkAddresses.registrar.proxy,
      thisNetworkAddresses.multiSig.apTeam.proxy,
      newNetworkInfo,
      hre
    );
  });
