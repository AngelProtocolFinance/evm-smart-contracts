import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying EndowmentMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const deployData = await deployEndowmentMultiSig(hre);

      if (!deployData) {
        return;
      }

      await hre.run("manage:registrar:updateConfig", {
        multisigFactory: deployData.factory.address,
        multisigEmitter: deployData.emitter.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData.emitter);
        await verify(hre, deployData.factory);
        await verify(hre, deployData.implementation);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
