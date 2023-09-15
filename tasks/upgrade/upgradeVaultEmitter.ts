import {task} from "hardhat/config";
import {VaultEmitter__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getProxyAdminOwner,
  getSigners,
  isLocalNetwork,
  logger,
  updateAddresses,
  upgradeProxy,
  verify,
} from "utils";

type TaskArgs = {
  proxyAdminPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("upgrade:VaultEmitter", "Will upgrade the implementation of the VaultEmitter contract")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Upgrading VaultEmitter proxy contract...");

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);
      const {deployer} = await getSigners(hre);

      const proxyAdminOwner = await getProxyAdminOwner(hre, taskArgs.proxyAdminPkey);

      const deployment = await upgradeProxy(
        new VaultEmitter__factory(deployer),
        addresses.multiSig.proxyAdmin,
        proxyAdminOwner,
        addresses.vaultEmitter.proxy
      );

      if (!deployment) {
        return;
      }

      await updateAddresses(
        {multiSig: {endowment: {implementation: deployment.contract.address}}},
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
