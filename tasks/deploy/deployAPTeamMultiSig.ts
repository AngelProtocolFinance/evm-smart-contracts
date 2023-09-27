import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {cliTypes} from "tasks/types";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
  admin?: string;
};

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam(
    "admin",
    "override for proxy admin wallet, default: proxyAdminMultisig",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
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
        to: deployments.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:AccountsDiamond:updateOwner", {
        to: deployments.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:IndexFund:transferOwnership", {
        to: deployments.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
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
