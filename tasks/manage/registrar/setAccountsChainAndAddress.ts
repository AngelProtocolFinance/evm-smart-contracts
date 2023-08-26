import {task} from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {connectSignerFromPkey, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {accountsDiamond: string; chainName: string; apTeamSignerPkey?: string;};

task("manage:registrar:setAccountsChainAndAddress")
  .addParam("accountsDiamond", "Address of the accounts contract on target Axelar blockchain")
  .addParam("chainName", "The Axelar blockchain name of the accounts contract")
  .addOptionalParam(
    "apTeamSignerPkey", 
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];

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

    const registrar = Registrar__factory.connect(registrarAddress, apTeamSigner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.pad(30, "Setting accounts contract on: ", taskArguments.chainName);
    logger.pad(30, "to contract at: ", taskArguments.accountsDiamond);
    const updateData = registrar.interface.encodeFunctionData("setAccountsContractAddressByChain", [
      taskArguments.chainName,
      taskArguments.accountsDiamond,
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamSigner
    );
    const tx = await apTeamMultisigContract.submitTransaction(
      registrar.address,
      0,
      updateData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();
  });
