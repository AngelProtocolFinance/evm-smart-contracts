import config from "config";
import {deployLocalRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
  owner: string;
};

task(
  "deploy:LocalRegistrarAndRouter",
  "Will deploy the Local Registrar contract and Router."
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying Registrar and Router..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {proxyAdmin, deployer} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      const localRegistrarDeployment = await deployLocalRegistrar(
        {
          owner: taskArgs.owner,
          deployer,
          proxyAdmin,
        },
        hre
      );

      if (!localRegistrarDeployment) {
        return;
      }

      const routerDeployment = await deployRouter(
        addresses.axelar.gateway,
        addresses.axelar.gasService,
        localRegistrarDeployment.address,
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, localRegistrarDeployment);
        if (routerDeployment) {
          await verify(hre, routerDeployment);
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
