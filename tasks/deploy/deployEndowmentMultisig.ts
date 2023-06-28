import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig} from "../helpers";

type TaskArgs = {
  apTeamMultisig?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying EndowmentMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const deployData = await deployEndowmentMultiSig(hre);

      if (!deployData) {
        return;
      }

      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {
          multisigFactory: deployData.factory.address,
          multisigEmitter: deployData.emitter.address,
        },
        hre
      );

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, deployData.emitter);
        await verify(hre, deployData.factory);
        await verify(hre, deployData.implementation);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
