import {deployLocalRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {
  confirmAction,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  verify,
  NetworkConnectionAction,
} from "utils";
import {Registrar__factory} from "typechain-types";
import {IAccountsStrategy} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "../helpers";
import {router} from "typechain-types/contracts/core";

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

      if (!routerDeployment) {
        return;
      }

      let network = await hre.ethers.provider.getNetwork();
      const networkInfo: IAccountsStrategy.NetworkInfoStruct = {
        chainId: network.chainId,
        router: routerDeployment.address,
        axelarGateway: addresses.axelar.gateway,
        ibcChannel: "",
        transferChannel: "",
        gasReceiver: addresses.axelar.gasService,
        gasLimit: 0,
      };
      await updateRegistrarNetworkConnections(
        localRegistrarDeployment.address,
        owner,
        networkInfo,
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, localRegistrarDeployment);
        await verify(hre, routerDeployment);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });