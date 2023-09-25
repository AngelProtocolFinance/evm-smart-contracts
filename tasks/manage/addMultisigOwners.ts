import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {MultiSigGeneric__factory} from "typechain-types";
import {confirmAction, connectSignerFromPkey, logger} from "utils";

type TaskArgs = {
  multisig: string;
  owners: string[];
  multisigOwnerPkey: string;
  yes: boolean;
};

task("manage:addMultisigOwners", "Will add the specified address to the multisig as an owner")
  .addParam("multisig", "Address of multisig", undefined, cliTypes.address)
  .addVariadicPositionalParam("owners", "Addresses of new owners")
  .addParam("multisigOwnerPkey", "Private Key for a valid Multisig Owner.")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArguments: TaskArgs, hre) => {
    try {
      logger.divider();

      const msOwner = await connectSignerFromPkey(taskArguments.multisigOwnerPkey, hre);

      const isConfirmed =
        taskArguments.yes ||
        (await confirmAction(`Adding new owner: ${await msOwner.getAddress()}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const multisig = MultiSigGeneric__factory.connect(taskArguments.multisig, msOwner);

      logger.out("Adding new owners:");
      logger.out(taskArguments.owners);
      const addOwnerData = multisig.interface.encodeFunctionData("addOwners", [
        taskArguments.owners,
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

      for (let owner of taskArguments.owners) {
        const isOwner = await multisig.isOwner(owner);
        if (!isOwner) {
          throw new Error("Unexpected: adding new owner failed");
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
