import { network } from "hardhat";
import {task, types} from "hardhat/config";
import { NetworkInfoStruct, NetworkConnectionAction } from "test/utils";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger, getChainIdFromNetworkName, getAddressesByNetworkId, DEFAULT_CONTRACT_ADDRESS_FILE_PATH} from "utils";

type TaskArgs = {networkName: string;};

task("manage:registrar:setNetworkInfo")
  .addParam(
    "networkName",
    "The name of the network to update",
    "",
    types.string
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {deployer} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, deployer);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    const chainId = getChainIdFromNetworkName(taskArguments.networkName)
    const subjectAddresses = getAddressesByNetworkId(chainId, DEFAULT_CONTRACT_ADDRESS_FILE_PATH)

    logger.divider();
    logger.out("Checking current network settings");
    let currentNetworkSettings = await registrar.queryNetworkConnection(taskArguments.networkName);

    if (
      currentNetworkSettings.chainId.eq(chainId) &&
      currentNetworkSettings.router == subjectAddresses.router.proxy &&
      currentNetworkSettings.axelarGateway == subjectAddresses.axelar.gateway &&
      currentNetworkSettings.gasReceiver == subjectAddresses.axelar.gasService 
    ) {
      logger.pad(10, "Network already configured");
      return;
    }

    logger.divider();
    logger.out("Setting network config according to contract-address.json");
    const networkInfo: NetworkInfoStruct = {
      chainId: chainId,
      router: subjectAddresses.router.proxy,
      axelarGateway: subjectAddresses.axelar.gateway,
      ibcChannel: "", 
      transferChannel: "",
      gasReceiver: subjectAddresses.axelar.gasService,
      gasLimit: 0 
    }
    await registrar.updateNetworkConnections(
      taskArguments.networkName, 
      networkInfo,
      NetworkConnectionAction.POST
    );
    let newNetworkSettings = await registrar.queryNetworkConnection(taskArguments.networkName);
    if ( 
      newNetworkSettings.chainId.eq(chainId) &&
      newNetworkSettings.router == subjectAddresses.router.proxy &&
      newNetworkSettings.axelarGateway == subjectAddresses.axelar.gateway &&
      newNetworkSettings.gasReceiver == subjectAddresses.axelar.gasService 
    ) {
      logger.out(`Network Info updated on ${taskArguments.networkName}`)
    }
    else {
      throw new Error(`Queried network info does not match expected new values, got: ${newNetworkSettings}, expected: ${networkInfo}`)
    }
  });
