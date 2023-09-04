import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {CharityApplications__factory} from "typechain-types";
import {
  confirmAction,
  getAddresses,
  getCharityApplicationsOwner,
  logger,
  structToObject,
} from "utils";

type TaskArgs = {
  accountsDiamond?: string;
  gasAmount?: number;
  expiry?: number;
  seedAsset?: string;
  seedSplitToLiquid?: number;
  seedAmount?: number;
  appsSignerPkey?: string;
  yes: boolean;
};

task("manage:CharityApplications:updateConfig", "Will update CharityApplications config")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam("gasAmount", "Amount of gas to be sent.", undefined, types.int)
  .addOptionalParam("expiry", "Expiry time for proposals.", undefined, types.int)
  .addOptionalParam("seedAsset", "Address of seed asset.")
  .addOptionalParam("seedAmount", "Amount of seed asset to be sent.", undefined, types.int)
  .addOptionalParam(
    "seedSplitToLiquid",
    "Percentage of seed asset to be sent to liquid.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "appsSignerPkey",
    "If running on prod, provide a pkey for a valid CharityApplications Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Updating CharityApplications config...");

      const addresses = await getAddresses(hre);

      const appsSigner = await getCharityApplicationsOwner(hre, taskArgs.appsSignerPkey);

      const charityApplications = CharityApplications__factory.connect(
        addresses.multiSig.charityApplications.proxy,
        appsSigner
      );

      // fetch current config
      logger.out("Querying current config...");
      const struct = await charityApplications.queryConfig();
      const transactionExpiry = await charityApplications.transactionExpiry();
      const curConfig = structToObject(struct);
      logger.out(structToObject({transactionExpiry, ...curConfig}));

      const {yes, appsSignerPkey, ...toUpdate} = taskArgs;

      logger.out("Config data to update:");
      logger.out(toUpdate);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      // update config
      logger.out("Updating config...");
      const data = charityApplications.interface.encodeFunctionData("updateConfig", [
        toUpdate.expiry || transactionExpiry,
        toUpdate.accountsDiamond || curConfig.accountsContract,
        toUpdate.seedSplitToLiquid || curConfig.seedSplitToLiquid,
        toUpdate.gasAmount || curConfig.gasAmount,
        toUpdate.seedAsset || curConfig.seedAsset,
        toUpdate.seedAmount || curConfig.seedAmount,
      ]);
      const isExecuted = await submitMultiSigTx(
        charityApplications.address,
        appsSigner,
        charityApplications.address,
        data
      );

      if (isExecuted) {
        logger.out("New config:");
        const newConfig = await charityApplications.queryConfig();
        const transactionExpiry = await charityApplications.transactionExpiry();
        logger.out(structToObject({transactionExpiry, ...newConfig}));
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
