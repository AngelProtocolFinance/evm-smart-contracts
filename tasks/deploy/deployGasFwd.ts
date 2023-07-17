import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {task} from "hardhat/config";
import {updateRegistrarConfig} from "tasks/helpers";
import {getSigners, getAddresses, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  skipVerify: boolean;
};

task("deploy:GasFwd", "Will deploy the GasFwd implementation and factory")
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);
      const {deployer, proxyAdmin} = await getSigners(hre);

      const gasFwdDeployment = await deployGasFwd(
        {deployer: deployer, admin: proxyAdmin, registrar: addresses.registrar.proxy},
        hre
      );

      if (!gasFwdDeployment) {
        return;
      }

      await updateRegistrarConfig(
        addresses.registrar.proxy,
        addresses.multiSig.apTeam.proxy,
        {gasFwdFactory: gasFwdDeployment.factory.address},
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, gasFwdDeployment.implementation);
        await verify(hre, gasFwdDeployment.factory);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
