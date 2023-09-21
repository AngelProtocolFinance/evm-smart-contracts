import {deployEndowmentMultiSigFactory} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:EndowmentMultiSigFactory", "Will deploy EndowmentMultiSigFactory contract")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Deploying EndowmentMultiSigFactory...");

      const addresses = await getAddresses(hre);
      const {deployer} = await getSigners(hre);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const deployData = await deployEndowmentMultiSigFactory(
        addresses.multiSig.endowment.implementation,
        addresses.registrar.proxy,
        addresses.multiSig.proxyAdmin,
        addresses.multiSig.apTeam.proxy,
        deployer,
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        multisigFactory: deployData.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData.implementation);
        await verify(hre, deployData.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
