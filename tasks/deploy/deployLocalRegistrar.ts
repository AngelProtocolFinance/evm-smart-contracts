import config from "config";
import {deployLocalRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getNetworkNameFromChainId, getSigners, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  skipVerify: boolean;
  yes: boolean;
  owner?: string;
};

task("deploy:LocalRegistrarAndRouter", "Will deploy the Local Registrar contract and Router.")
  .addOptionalParam("owner", "The owner wallet for both router and registrar")
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

      const owner = taskArgs.owner || addresses.multiSig.apTeam.proxy;

      const localRegistrarDeployment = await deployLocalRegistrar(
        {
          owner: owner,
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
      
      logger.divider()
      let network = await hre.ethers.provider.getNetwork();
      if(!isLocalNetwork(hre)) {
        logger.out("Updating network connection info in the registrar")
        await hre.run("manage:registrar:setNetworkInfo", 
        {networkName: getNetworkNameFromChainId(network.chainId)}
        )
      }

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
