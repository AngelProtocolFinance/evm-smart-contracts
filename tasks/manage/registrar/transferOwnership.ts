import {task} from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {confirmAction, connectSignerFromPkey, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {to: string; apTeamSignerPkey?: string; yes: boolean};

task("manage:registrar:transferOwnership")
  .addOptionalParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address. Will default to `contract-address.json > multiSig.apTeam.proxy` if none is provided."
  )
  .addOptionalParam(
    "apTeamSignerPkey", 
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Connecting to registrar on specified network...");
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);
      
      let apTeamSigner: SignerWithAddress;
      if(!apTeamMultisigOwners && taskArgs.apTeamSignerPkey) {
        apTeamSigner = await connectSignerFromPkey(taskArgs.apTeamSignerPkey, hre);
      }
      else if(!apTeamMultisigOwners) {
        throw new Error("Must provide a pkey for AP Team signer on this network");
      }
      else {
        apTeamSigner = apTeamMultisigOwners[0]
      }

      const registrar = Registrar__factory.connect(
        addresses.registrar.proxy,
        apTeamSigner
      );
      logger.out(`Connected to Registrar at: ${registrar.address}`);

      const newOwner = taskArgs.to || addresses.multiSig.apTeam.proxy;

      const curOwner = await registrar.owner();
      if (curOwner === newOwner) {
        return logger.out(`"${newOwner}" is already the owner.`);
      }
      logger.out(`Current owner: ${curOwner}`);

      const isConfirmed =
        taskArgs.yes || (await confirmAction(`Transfer ownership to: ${newOwner}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out(`Transferring ownership to: ${newOwner}...`);
      const data = registrar.interface.encodeFunctionData("transferOwnership", [newOwner]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamSigner
      );
      const tx = await apTeamMultiSig.submitTransaction(registrar.address, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      const updatedOwner = await registrar.owner();
      logger.out(`New owner: ${updatedOwner}`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
