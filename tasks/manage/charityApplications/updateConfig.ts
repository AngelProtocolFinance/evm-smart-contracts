import {task, types} from "hardhat/config";
import {CharityApplications__factory} from "typechain-types";
import {getAddresses, getSigners, logger, structToObject} from "utils";

type TaskArgs = {
  accountsDiamond?: string;
  gasAmount?: number;
  expiry?: number;
  seedAsset?: string;
  seedSplitToLiquid?: number;
  seedAmount?: number;
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
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Updating CharityApplications config...");

      const addresses = await getAddresses(hre);
      const {charityApplicationsOwners} = await getSigners(hre);

      const charityApplications = CharityApplication__factory.connect(
        addresses.multiSig.charityApplications.proxy,
        charityApplicationsOwners[0]
      );

      // fetch current config
      logger.out("Querying current config...");
      const struct = await charityApplications.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);
      logger.out("Config data to update:");
      logger.out(taskArgs);

      // update config
      logger.out("Updating config...");
      const updateConfigData = charityApplications.interface.encodeFunctionData("updateConfig", [
        taskArgs.expiry || curConfig.expiry,
        taskArgs.accountsDiamond || curConfig.accountsContract,
        taskArgs.seedSplitToLiquid || curConfig.seedSplitToLiquid,
        taskArgs.gasAmount || curConfig.gasAmount,
        taskArgs.seedAsset || curConfig.seedAsset,
        taskArgs.seedAmount || curConfig.seedAmount,
      ]);
      const tx = await charityApplicationsOwners[0].submitTransaction(
        charityApplications.address,
        0,
        updateConfigData,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      logger.out("Config updated.");
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
