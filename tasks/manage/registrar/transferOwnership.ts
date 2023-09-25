import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {Registrar__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {to?: string; apTeamSignerPkey?: string; yes: boolean};

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

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const registrar = Registrar__factory.connect(addresses.registrar.proxy, apTeamOwner);
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
      const isExecuted = await submitMultiSigTx(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner,
        registrar.address,
        data
      );

      if (isExecuted) {
        const updatedOwner = await registrar.owner();
        logger.out(`New owner: ${updatedOwner}`);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
