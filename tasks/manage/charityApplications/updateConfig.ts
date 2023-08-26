import {task, types} from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {CharityApplications__factory} from "typechain-types";
import {confirmAction, connectSignerFromPkey, getAddresses, getSigners, logger, structToObject} from "utils";

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
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Updating CharityApplications config...");

      const addresses = await getAddresses(hre);
      const {charityApplicationsOwners} = await getSigners(hre);
      let appsSigner: SignerWithAddress;
      if(!charityApplicationsOwners && taskArgs.appsSignerPkey) {
        appsSigner = await connectSignerFromPkey(taskArgs.appsSignerPkey, hre);
      }
      else if(!charityApplicationsOwners) {
        throw new Error("Must provide a pkey for Charity Applications Multisig signer on this network");
      }
      else {
        appsSigner = charityApplicationsOwners[0]
      }

      
      const charityApplications = CharityApplications__factory.connect(
        addresses.multiSig.charityApplications.proxy,
        appsSigner
      );

      // fetch current config
      logger.out("Querying current config...");
      const struct = await charityApplications.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);
      const transactionExpiry = await charityApplications.transactionExpiry();
      logger.out(structToObject({transactionExpiry, ...curConfig}));

      logger.out("Config data to update:");
      logger.out(taskArgs);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      // update config
      logger.out("Updating config...");
      const tx = await charityApplications.updateConfig(
        taskArgs.expiry || transactionExpiry,
        taskArgs.accountsDiamond || curConfig.accountsContract,
        taskArgs.seedSplitToLiquid || curConfig.seedSplitToLiquid,
        taskArgs.gasAmount || curConfig.gasAmount,
        taskArgs.seedAsset || curConfig.seedAsset,
        taskArgs.seedAmount || curConfig.seedAmount
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      logger.out("New config:");
      const newConfig = await charityApplications.queryConfig();
      logger.out(structToObject(newConfig));
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
