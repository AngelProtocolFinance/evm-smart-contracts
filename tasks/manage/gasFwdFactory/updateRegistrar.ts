import {task} from "hardhat/config";
import {APTeamMultiSig__factory, GasFwdFactory__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {newRegistrar: string; apTeamSignerPkey?: string; yes: boolean};

task(
  "manage:GasFwdFactory:updateRegistrar",
  "Will update the registrar address of the GasFwdFactory"
)
  .addOptionalParam(
    "newRegistrar",
    "Address of the new registrar. Will default to `contract-address.json > registrar.proxy` if none is provided."
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

      const newRegistrar = taskArgs.newRegistrar || addresses.registrar.proxy;

      logger.out("Querying current GasFwdFactory registrar...");
      const gasFwdFactory = GasFwdFactory__factory.connect(addresses.gasFwd.factory, apTeamOwner);
      const curRegistrar = await gasFwdFactory.registrar();
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
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner
      );
      const payload = gasFwdFactory.interface.encodeFunctionData("updateRegistrar", [newRegistrar]);
      const tx = await apTeamMultiSig.submitTransaction(gasFwdFactory.address, 0, payload, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      const updatedRegistrar = await gasFwdFactory.registrar();
      logger.out(`New registrar: ${updatedRegistrar}`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
