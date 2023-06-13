import {task, types} from "hardhat/config";
import {APTeamMultiSig__factory, IndexFund__factory} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {to: string; yes: boolean};

task("manage:indexFund:updateOwner", "Will update the owner of the IndexFund")
  .addOptionalParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address. Will default to `contract-address.json > multiSig.apTeam.proxy` if none is provided."
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      const newOwner = taskArgs.to || addresses.multiSig.apTeam.proxy;

      logger.out("Querying current IndexFund owner...");
      const indexFund = IndexFund__factory.connect(
        addresses.indexFund.proxy,
        apTeamMultisigOwners[0]
      );
      const curOwner = (await indexFund.queryConfig()).owner;
      if (curOwner === newOwner) {
        return logger.out(`"${newOwner}" is already the owner.`);
      }
      logger.pad(50, "Current owner: ", curOwner);

      const isConfirmed =
        taskArgs.yes || (await confirmAction(`Transfer ownership to: ${newOwner}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Transferring ownership...");
      const data = indexFund.interface.encodeFunctionData("updateOwner", [newOwner]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultiSig.submitTransaction(
        "IndexFund: transfer ownership",
        `Transfer ownership to ${newOwner}`,
        addresses.accounts.diamond,
        0,
        data,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
