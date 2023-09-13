import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {
  apTeamSignerPkey?: string;
  registrar?: string;
  yes: boolean;
};

task(
  "manage:endowmentMultiSigFactory:updateRegistrar",
  "Will update the EndowmentMultiSigFactory's registrar address"
)
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();

      const addresses = await getAddresses(hre);
      const registrarAddress = taskArgs.registrar || addresses.registrar.proxy;

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(
          `Updating EndowmentMultiSigFactory's registrar address to ${registrarAddress}...`
        ));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory,
        hre.ethers.provider
      );
      if ((await endowmentMultiSigFactory.getRegistrarAddress()) === registrarAddress) {
        return logger.out(`"${registrarAddress}" is already the stored registrar address.`);
      }

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      logger.out("Updating registrar address...");
      const data = endowmentMultiSigFactory.interface.encodeFunctionData("updateRegistrar", [
        registrarAddress,
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        endowmentMultiSigFactory.address,
        data
      );
      if (!isExecuted) {
        return;
      }
      const newRegAddr = await endowmentMultiSigFactory.getRegistrarAddress();
      if (newRegAddr !== registrarAddress) {
        throw new Error(
          `Unexpected: expected new registrar address "${registrarAddress}", but got "${newRegAddr}"`
        );
      }
    } catch (error) {
      logger.out(
        `Updating EndowmentMultiSigFactory's registrar address failed, reason: ${error}`,
        logger.Level.Error
      );
    }
  });
