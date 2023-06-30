import {task} from "hardhat/config";
import {
  APTeamMultiSig__factory,
  AccountsQueryEndowments__factory,
  AccountsUpdate__factory,
} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {to: string; yes: boolean};

task("manage:AccountsDiamond:updateOwner", "Will update the owner of the Accounts Diamond")
  .addOptionalParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address. Will default to `contract-address.json > multiSig.apTeam.proxy` if none is provided."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      const newOwner = taskArgs.to || addresses.multiSig.apTeam.proxy;

      logger.out("Querying current Diamond owner...");
      const accountsQueryEndowments = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeamMultisigOwners[0]
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
        apTeamMultisigOwners[0]
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateOwner", [newOwner]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultiSig.submitTransaction(addresses.accounts.diamond, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);

      const updatedOwner = (await accountsQueryEndowments.queryConfig()).owner;
      logger.out(`New owner: ${updatedOwner}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
