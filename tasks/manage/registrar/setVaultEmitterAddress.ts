import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {Registrar__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {to: string; apTeamSignerPkey?: string; yes: boolean};

task("manage:registrar:setVaultEmitterAddress")
  .addParam("to", "Address of the VaultEmitter contract", undefined, types.string)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out(`Updating Registrar's VaultEmitter address...`);
      const addresses = await getAddresses(hre);

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const registrar = Registrar__factory.connect(addresses.registrar.proxy, apTeamOwner);
      const currVaultEmitter = await registrar.getVaultEmitterAddress();
      if (currVaultEmitter === taskArgs.to) {
        return logger.out(`VaultEmitter address is already set to "${currVaultEmitter}".`);
      }
      logger.out(`Current VaultEmitter address: ${currVaultEmitter}`);

      const isConfirmed =
        taskArgs.yes || (await confirmAction(`New VaultEmitter address: ${taskArgs.to}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const updateData = registrar.interface.encodeFunctionData("setVaultEmitterAddress", [
        taskArgs.to,
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        registrar.address,
        updateData
      );

      if (isExecuted) {
        const newVaultEmitter = await registrar.getVaultEmitterAddress();
        logger.out(`New VaultEmitter address: ${newVaultEmitter}`);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
