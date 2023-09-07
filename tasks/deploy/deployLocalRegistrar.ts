import {deployLocalRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  skipVerify: boolean;
  apTeamSignerPkey?: string;
  yes: boolean;
  owner?: string;
};

task("deploy:LocalRegistrarAndRouter", "Will deploy the Local Registrar contract and Router.")
  .addOptionalParam("owner", "The owner wallet for both router and registrar")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
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

      const {deployer} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const owner = taskArgs.owner || addresses.multiSig.apTeam.proxy;

      const localRegistrar = await deployLocalRegistrar(
        {
          owner: owner,
          deployer: deployer,
          proxyAdmin: addresses.multiSig.proxyAdmin,
        },
        hre
      );

      if (!localRegistrar) {
        return;
      }

      const router = await deployRouter(
        localRegistrar.proxy.contract.address,
        addresses.multiSig.proxyAdmin,
        deployer,
        hre
      );

      const networkInfo: Partial<LocalRegistrarLib.NetworkInfoStruct> = {
        refundAddr: addresses.multiSig.apTeam.proxy,
      };
      await hre.run("manage:registrar:updateNetworkConnections", {
        ...networkInfo,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, localRegistrar.implementation);
        await verify(hre, localRegistrar.proxy);
        await verify(hre, router.implementation);
        await verify(hre, router.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
