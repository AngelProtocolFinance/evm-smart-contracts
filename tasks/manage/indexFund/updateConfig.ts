import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IndexFund__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger, structToObject} from "utils";

type TaskArgs = {
  registrarContract: string;
  fundingGoal: number;
  fundRotation: number;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task("manage:IndexFund:updateConfig", "Will update the config of the IndexFund")
  .addOptionalParam(
    "registrarContract",
    "New Registrar contract. Will do a local lookup from contract-address.json if none is provided.funding rotation blocks & funding goal amount."
  )
  .addOptionalParam("fundingGoal", "Funding rotation blocks.", undefined, types.int)
  .addOptionalParam("fundRotation", "Funding goal amount.", undefined, types.int)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {yes, apTeamSignerPkey, ...newConfig} = taskArgs;

      logger.divider();
      const addresses = await getAddresses(hre);

      const apTeamOwner = await getAPTeamOwner(hre, apTeamSignerPkey);

      logger.out("Querying current IndexFund registrar...");
      const indexFund = IndexFund__factory.connect(addresses.indexFund.proxy, apTeamOwner);
      const curConfig = await indexFund.queryConfig();
      logger.out(structToObject(curConfig));

      logger.out("Config data to update:");
      logger.out(newConfig);

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Update Registrar address to: ${newConfig.registrarContract}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const data = indexFund.interface.encodeFunctionData("updateConfig", [
        newConfig.registrarContract || curConfig.registrarContract,
        newConfig.fundRotation ?? curConfig.fundRotation,
        newConfig.fundingGoal ?? curConfig.fundingGoal,
      ]);

      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        indexFund.address,
        data
      );

      if (isExecuted) {
        logger.out("New config:");
        const updatedConfig = await indexFund.queryConfig();
        logger.out(structToObject(updatedConfig));
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
