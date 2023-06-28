import {task} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {to: string; yes: boolean};

task("manage:registrar:transferOwnership")
  .addOptionalParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address. Will default to `contract-address.json > multiSig.apTeam.proxy` if none is provided."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Connecting to registrar on specified network...");
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);
      const registrar = Registrar__factory.connect(
        addresses.registrar.proxy,
        apTeamMultisigOwners[0]
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
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultiSig.submitTransaction(
        "Registrar: transfer ownership",
        `Transfer ownership to ${newOwner}`,
        registrar.address,
        0,
        data,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      const updatedOwner = await registrar.owner();
      logger.out(`New owner: ${updatedOwner}`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
