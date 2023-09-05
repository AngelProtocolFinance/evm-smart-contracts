import {deployVaultEmitter} from "contracts/core/vault/scripts/deployVaultEmitter";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:VaultEmitter", "Will deploy VaultEmitter contract")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying VaultEmitter..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      const deployment = await deployVaultEmitter(addresses.multiSig.proxyAdmin, deployer, hre);

      await hre.run("manage:registrar:setVaultEmitterAddress", {
        to: deployment.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment.implementation);
        await verify(hre, deployment.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
