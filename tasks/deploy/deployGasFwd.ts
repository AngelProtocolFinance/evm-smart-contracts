import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:GasFwd", "Will deploy the GasFwd implementation and factory")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const {deployer} = await getSigners(hre);

      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying GasFwd and GasFwdFactory."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const gasFwdDeployment = await deployGasFwd(
        {
          deployer: deployer,
          proxyAdmin: addresses.multiSig.proxyAdmin,
          factoryOwner: addresses.multiSig.apTeam.proxy,
          registrar: addresses.registrar.proxy,
        },
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        gasFwdFactory: gasFwdDeployment.factory.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, gasFwdDeployment.implementation);
        await verify(hre, gasFwdDeployment.factory);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
