import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {
  confirmAction,
  getAPTeamOwner,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  verify,
} from "utils";
import {updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  apTeamMultisig?: string;
  registrar?: string;
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:Router", "Will deploy Router contract")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying Router..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);
      const {deployer} = await getSigners(hre);

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const deployment = await deployRouter(
        registrar,
        addresses.multiSig.proxyAdmin,
        deployer,
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      await updateRegistrarNetworkConnections(
        registrar,
        apTeamMultiSig,
        {router: deployment.proxy.address},
        apTeamOwner,
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployment.implementation);
        await verify(hre, deployment.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
