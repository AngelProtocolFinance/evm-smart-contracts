import {task} from "hardhat/config";
import {APTeamMultiSig__factory, IndexFund__factory} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {newRegistrar: string; yes: boolean};

task("manage:IndexFund:updateRegistrar", "Will update the registrar address of the IndexFund")
  .addOptionalParam(
    "newRegistrar",
    "Address of the new registrar. Will default to `contract-address.json > registrar.proxy` if none is provided."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      const newRegistrar = taskArgs.newRegistrar || addresses.registrar.proxy;

      logger.out("Querying current IndexFund registrar...");
      const indexFund = IndexFund__factory.connect(
        addresses.indexFund.proxy,
        apTeamMultisigOwners[0]
      );
      const curRegistrar = (await indexFund.queryConfig()).registrarContract;
      if (curRegistrar === newRegistrar) {
        return logger.out(`"${newRegistrar}" is already set as the registrar address.`);
      }
      logger.out(`Current registrar: ${curRegistrar}`);

      const isConfirmed =
        taskArgs.yes || (await confirmAction(`Update Registrar address to: ${newRegistrar}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out(`Updating Registrar address to: ${newRegistrar}...`);
      const curOwner = (await indexFund.queryConfig()).owner;
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        curOwner, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const data = indexFund.interface.encodeFunctionData("updateRegistrar", [newRegistrar]);
      const tx = await apTeamMultiSig.submitTransaction(indexFund.address, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      const updatedOwner = (await indexFund.queryConfig()).registrarContract;
      logger.out(`New registrar: ${updatedOwner}`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
