import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
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
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
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

      logger.out(`Updating EndowmentMultiSigFactory's registrar address to ${registrarAddress}...`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
        addresses.multiSig.endowment.factory.proxy,
        hre.ethers.provider
      );
      if ((await endowmentMultiSigFactory.getRegistrar()) === registrarAddress) {
        return logger.out(`"${registrarAddress}" is already the stored registrar address.`);
      }

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      // submitting the Tx
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
      const newRegAddr = await endowmentMultiSigFactory.getRegistrar();
      if (newRegAddr !== registrarAddress) {
        throw new Error(
          `Unexpected: expected new registrar address "${registrarAddress}", but got "${newRegAddr}"`
        );
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
