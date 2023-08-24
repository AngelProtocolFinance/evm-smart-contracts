import {task} from "hardhat/config";
import {MultiSigGeneric__factory} from "typechain-types";
import {getSigners, logger} from "utils";

type TaskArgs = {multisig: string; owner: string};

task("manage:addMultisigOwner", "Will add the specified address to the multisig as an owner")
  .addParam("multisig", "Address of multisig")
  .addParam("owner", "Address of the new owner")
  .setAction(async (taskArguments: TaskArgs, hre) => {
    try {
      const {apTeam2} = await getSigners(hre);

      const multisig = MultiSigGeneric__factory.connect(taskArguments.multisig, apTeam2);

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

      const eventName = "TransactionSubmitted";
      if (!receipt.events?.length) {
        throw new Error("Unexpected: no events emitted.");
      }
      const transactionSubmittedEvent = receipt.events
        .filter((event) => event.event === eventName)
        ?.at(0);
      if (!transactionSubmittedEvent) {
        throw new Error(`Unexpected: ${eventName} not emitted.`);
      }
      if (!transactionSubmittedEvent.args) {
        throw new Error(`Unexpected: no args in ${eventName} event.`);
      }
      const transactionId = transactionSubmittedEvent.args["transactionId"];
      if (!transactionId) {
        throw new Error(`Unexpected: no transactionId in ${eventName} args.`);
      }

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
