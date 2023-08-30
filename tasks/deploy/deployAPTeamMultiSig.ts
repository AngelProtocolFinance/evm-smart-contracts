import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("admin", "override for proxy admin wallet, default: proxyAdminMultisig")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean; admin?: string}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying APTeamMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {deployer} = await getSigners(hre);
      let deployments;
      if (taskArgs.admin) {
        deployments = await deployAPTeamMultiSig(taskArgs.admin, deployer, hre);
      } else {
        const addresses = await getAddresses(hre);
        deployments = await deployAPTeamMultiSig(addresses.multiSig.proxyAdmin, deployer, hre);
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
