import {deployEndowmentMultiSig} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Deploying EndowmentMultiSig...");

      const {deployer} = await getSigners(hre);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const deployData = await deployEndowmentMultiSig(deployer, hre);

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
