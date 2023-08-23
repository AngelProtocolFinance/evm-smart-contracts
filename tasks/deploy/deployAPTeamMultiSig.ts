import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, isLocalNetwork, logger, verify} from "utils";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying APTeamMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const deployments = await deployAPTeamMultiSig(hre);

      if (!deployments) {
        return;
      }

      await hre.run("manage:registrar:transferOwnership", {
        to: deployments.proxy.address,
        yes: true,
      });
      await hre.run("manage:AccountsDiamond:updateOwner", {
        to: deployments.proxy.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:transferOwnership", {
        to: deployments.proxy.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployments.implementation);
        await verify(hre, deployments.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
