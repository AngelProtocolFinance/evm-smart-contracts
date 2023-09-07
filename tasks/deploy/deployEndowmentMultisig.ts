import {deployEndowmentMultiSig} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, isLocalNetwork, getAddresses, logger, verify, getSigners} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addOptionalParam(
    "registrar",
    "Addresss of the registrar contract. Will do a local lookup from contract-address.json if none is provided."
  )
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

      const registrarAddress = taskArgs.registrar || addresses.registrar.proxy;

      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying EndowmentMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const deployData = await deployEndowmentMultiSig(
        registrarAddress,
        addresses.multiSig.proxyAdmin,
        addresses.multiSig.apTeam.proxy,
        deployer,
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        multisigFactory: deployData.factory.contract.address,
        multisigEmitter: deployData.emitter.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData.emitter.implementation);
        await verify(hre, deployData.emitter.proxy);
        await verify(hre, deployData.factory);
        await verify(hre, deployData.implementation);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
