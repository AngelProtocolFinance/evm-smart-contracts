import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {AccountsQueryEndowments__factory, AccountsUpdate__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger, structToObject} from "utils";

type TaskArgs = {
  registrarContract?: string;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task("manage:accounts:updateConfig", "Will update Accounts Diamond config")
  .addOptionalParam(
    "registrarContract",
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

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      logger.out("Querying current config...");
      const accountsQueryEndowments = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const curConfig = await accountsQueryEndowments.queryConfig();
      logger.out(JSON.stringify(structToObject(curConfig), undefined, 2));

      const registrarContract = taskArgs.registrarContract || curConfig.registrarContract;
      logger.out("Config data to update:");
      logger.out({registrarContract});

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const accountsUpdate = AccountsUpdate__factory.connect(
        addresses.accounts.diamond,
        apTeamOwner
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateConfig", [registrarContract]);

      const isExecuted = await submitMultiSigTx(
        curConfig.owner, // ensure connection to current owning APTeamMultiSig contract
        apTeamOwner,
        addresses.accounts.diamond,
        data
      );

      if (isExecuted) {
        const newConfig = await accountsQueryEndowments.queryConfig();
        logger.out("New config:");
        logger.out(JSON.stringify(structToObject(newConfig), undefined, 2));
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
