import {task} from "hardhat/config";
import {MultiSigGeneric__factory} from "typechain-types";
import {confirmAction, connectSignerFromPkey, getEvents, logger} from "utils";

type TaskArgs = {
  multisig: string;
  owner: string;
  multisigOwnerPkey: string;
  yes: boolean;
};

task("manage:addMultisigOwner", "Will add the specified address to the multisig as an owner")
  .addParam("multisig", "Address of multisig")
  .addParam("owner", "Address of the new owner")
  .addParam("multisigOwnerPkey", "Private Key for a valid Multisig Owner.")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArguments: TaskArgs, hre) => {
    try {
      logger.divider();

      const msOwner = await connectSignerFromPkey(taskArguments.multisigOwnerPkey, hre);

      const isConfirmed =
        taskArguments.yes || (await confirmAction(`Adding new owner: ${msOwner.address}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const multisig = MultiSigGeneric__factory.connect(taskArguments.multisig, msOwner);

      const alreadyOwner = await multisig.isOwner(taskArguments.owner);
      if (alreadyOwner) {
        return logger.out(
          `Account with address ${taskArguments.owner} is already an owner`,
          logger.Level.Warn
        );
      }

      logger.out("Adding new owner:");
      logger.out(taskArguments.owner);
      const addOwnerData = multisig.interface.encodeFunctionData("addOwners", [
        [taskArguments.owner],
      ]);

      const tx = await multisig.submitTransaction(
        multisig.address, //destination,
        0, //value
        addOwnerData, //data)
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      const receipt = await tx.wait();

      const transactionSubmittedEvent = getEvents(
        receipt.events,
        multisig,
        multisig.filters.TransactionSubmitted()
      ).at(0);
      if (!transactionSubmittedEvent) {
        throw new Error("Unexpected: TransactionSubmitted not emitted.");
      }

      const transactionId = transactionSubmittedEvent.args.transactionId;

      if ((await multisig.transactions(transactionId)).executed) {
        if (await multisig.isOwner(taskArguments.owner)) {
          logger.out(`Account with address ${taskArguments.owner} is now one of the owners.`);
        } else {
          throw new Error("Unexpected: adding new owner failed");
        }
      } else if (await multisig.isConfirmed(transactionId)) {
        logger.out(`Transaction with ID "${transactionId}" confirmed, awaiting execution.`);
      } else {
        logger.out(
          `Transaction with ID "${transactionId}" submitted, awaiting confirmation by other owners.`
        );
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
