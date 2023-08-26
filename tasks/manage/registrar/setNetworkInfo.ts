import {task, types} from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {updateRegistrarNetworkConnections} from "tasks/helpers";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {
  connectSignerFromPkey,
  getAddresses,
  logger,
  getAddressesByNetworkId,
  getChainIdFromNetworkName,
  DEFAULT_CONTRACT_ADDRESS_FILE_PATH,
  getSigners,
} from "utils";

type TaskArgs = {
  networkName: string;
  refundAddr?: string;
  apTeamSignerPkey?: string;
};

task("manage:registrar:setNetworkInfo", "Set network info for a specified network")
  .addParam(
    "networkName",
    "The name of the network using Axelars naming convention",
    "",
    types.string
  )
  .addOptionalParam(
    "refundAddr",
    "Optional to set the refund address, otherwise will keep what has already been set",
    "",
    types.string
  )
  .addOptionalParam(
    "apTeamSignerPkey", 
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");

    const networkId = getChainIdFromNetworkName(taskArguments.networkName);
    const thisNetworkAddresses = await getAddresses(hre);

    const {apTeamMultisigOwners} = await getSigners(hre);
    let apTeamSigner: SignerWithAddress;
    if(!apTeamMultisigOwners && taskArguments.apTeamSignerPkey) {
      apTeamSigner = await connectSignerFromPkey(taskArguments.apTeamSignerPkey, hre);
    }
    else if(!apTeamMultisigOwners) {
      throw new Error("Must provide a pkey for AP Team signer on this network");
    }
    else {
      apTeamSigner = apTeamMultisigOwners[0]
    }


    const thatNetworkAddresses = getAddressesByNetworkId(
      networkId,
      DEFAULT_CONTRACT_ADDRESS_FILE_PATH
    );
    const newNetworkInfo: Partial<LocalRegistrarLib.NetworkInfoStruct> = {
      chainId: networkId,
      router: thatNetworkAddresses.router.proxy,
      axelarGateway: thatNetworkAddresses.axelar.gateway,
      gasReceiver: thatNetworkAddresses.axelar.gasService,
    };
    if (taskArguments.refundAddr) {
      newNetworkInfo.refundAddr = taskArguments.refundAddr;
    }

    await updateRegistrarNetworkConnections(
      thisNetworkAddresses.registrar.proxy,
      thisNetworkAddresses.multiSig.apTeam.proxy,
      newNetworkInfo,
      apTeamSigner,
      hre
    );
  });
