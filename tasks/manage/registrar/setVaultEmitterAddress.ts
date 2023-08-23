import {task, types} from "hardhat/config";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {vaultEmitter: string; yes: boolean};

task("manage:registrar:setVaultEmitterAddress")
  .addParam("vaultEmitter", "Address of the VaultEmitter contract", undefined, types.string)
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out(`Updating Registrar's VaultEmitter address to ${taskArgs.vaultEmitter}...`);
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      const registrar = Registrar__factory.connect(
        addresses.registrar.proxy,
        apTeamMultisigOwners[0]
      );
      const currVaultEmitter = await registrar.getVaultEmitterAddress();
      if (currVaultEmitter === taskArgs.vaultEmitter) {
        return logger.out(`VaultEmitter address is already set to "${currVaultEmitter}".`);
      }
      logger.out(`Current VaultEmitter address: ${currVaultEmitter}`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating VaultEmitter address...");
      const updateData = registrar.interface.encodeFunctionData("setVaultEmitterAddress", [
        taskArgs.vaultEmitter,
      ]);
      const apTeamMultisigContract = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy,
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultisigContract.submitTransaction(
        registrar.address,
        0,
        updateData,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      const newVaultEmitter = await registrar.getVaultEmitterAddress();
      logger.out(`New VaultEmitter address: ${newVaultEmitter}`);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
