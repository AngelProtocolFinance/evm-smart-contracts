import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {MultiSigGeneric__factory} from "typechain-types";
import {confirmAction, connectSignerFromPkey, logger} from "utils";

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

      const isExecuted = await submitMultiSigTx(
        multisig.address,
        msOwner,
        multisig.address,
        addOwnerData
      );

      if (!isExecuted) {
        return;
      }

      const isOwner = await multisig.isOwner(taskArguments.owner);
      if (!isOwner) {
        throw new Error("Unexpected: adding new owner failed");
      }
      logger.out(`Account with address ${taskArguments.owner} is now one of the owners.`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
