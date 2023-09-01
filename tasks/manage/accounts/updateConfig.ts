import {task} from "hardhat/config";
import {
  APTeamMultiSig__factory,
  AccountsQueryEndowments__factory,
  AccountsUpdate__factory,
} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger, structToObject} from "utils";

type TaskArgs = {
  registrarContract?: string;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task("manage:accounts:updateConfig", "Will update Accounts Diamond config")
  .addOptionalParam(
    "registrarContract",
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

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      logger.out("Querying current config...");
      const accountsQueryEndowments = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const curConfig = await accountsQueryEndowments.queryConfig();
      logger.out(structToObject(curConfig));

      logger.out("Config data to update:");
      logger.out({registrarContract: taskArgs.registrarContract});

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const accountsUpdate = AccountsUpdate__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateConfig", [
        taskArgs.registrarContract || curConfig.registrarContract,
      ]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        curConfig.owner, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner
      );
      const tx = await apTeamMultiSig.submitTransaction(addresses.accounts.diamond, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
