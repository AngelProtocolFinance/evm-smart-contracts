import {deployLocalRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {
  confirmAction,
  connectSignerFromPkey,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  verify,
} from "utils";
import {updateRegistrarNetworkConnections} from "../helpers";

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

      const {deployer, apTeamMultisigOwners} = await getSigners(hre);

      let apTeamSigner: SignerWithAddress;
      if (!apTeamMultisigOwners && taskArgs.apTeamSignerPkey) {
        apTeamSigner = await connectSignerFromPkey(taskArgs.apTeamSignerPkey, hre);
      } else if (!apTeamMultisigOwners) {
        throw new Error("Must provide a pkey for AP Team signer on this network");
      } else {
        apTeamSigner = apTeamMultisigOwners[0];
      }

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
        localRegistrar.proxy.address,
        addresses.multiSig.proxyAdmin,
        deployer,
        hre
      );

      let network = await hre.ethers.provider.getNetwork();
      const networkInfo: LocalRegistrarLib.NetworkInfoStruct = {
        chainId: network.chainId,
        router: router.proxy.address,
        axelarGateway: addresses.axelar.gateway,
        gasReceiver: addresses.axelar.gasService,
        refundAddr: addresses.multiSig.apTeam.proxy,
      };
      await updateRegistrarNetworkConnections(
        localRegistrar.proxy.address,
        owner,
        networkInfo,
        apTeamSigner,
        hre
      );

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
