import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {AccountsQueryEndowments__factory, AccountsUpdate__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {to: string; apTeamSignerPkey?: string; yes: boolean};

task("manage:AccountsDiamond:updateOwner", "Will update the owner of the Accounts Diamond")
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

      logger.out("Querying current Diamond owner...");
      const accountsQueryEndowments = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const curOwner = (await accountsQueryEndowments.queryConfig()).owner;
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
      const accountsUpdate = AccountsUpdate__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateOwner", [newOwner]);

      const isExecuted = await submitMultiSigTx(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner,
        addresses.accounts.diamond,
        data
      );

      if (isExecuted) {
        const updatedOwner = (await accountsQueryEndowments.queryConfig()).owner;
        logger.out(`New owner: ${updatedOwner}`);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
