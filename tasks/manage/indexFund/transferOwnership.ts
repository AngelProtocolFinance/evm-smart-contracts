import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {IndexFund__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  to: string;
  yes: boolean;
};

task("manage:IndexFund:transferOwnership", "Will update the owner of the IndexFund")
  .addOptionalParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address. Will default to `contract-address.json > multiSig.apTeam.proxy` if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      const addresses = await getAddresses(hre);

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const newOwner = taskArgs.to || addresses.multiSig.apTeam.proxy;

      logger.out("Querying current IndexFund owner...");
      const indexFund = IndexFund__factory.connect(addresses.indexFund.proxy, apTeamOwner);
      const curOwner = await indexFund.owner();
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
      const data = indexFund.interface.encodeFunctionData("transferOwnership", [newOwner]);
      const isExecuted = await submitMultiSigTx(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner,
        indexFund.address,
        data
      );

      if (isExecuted) {
        const updatedOwner = await indexFund.owner();
        logger.out(`New owner: ${updatedOwner}`);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
