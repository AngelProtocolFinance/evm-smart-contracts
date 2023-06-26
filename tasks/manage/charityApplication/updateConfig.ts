import {task, types} from "hardhat/config";
import {CharityApplication__factory} from "typechain-types";
import {getAddresses, getSigners, logger, structToObject} from "utils";

type TaskArgs = {
  accountsDiamond?: string;
  fundSeedAsset?: boolean;
  gasAmount?: number;
  newEndowGasMoney?: boolean;
  proposalExpiry?: number;
  seedAsset?: string;
  seedSplitToLiquid?: number;
  seedAssetAmount?: number;
};

task("manage:CharityApplication:updateConfig", "Will update CharityApplication config")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "fundSeedAsset",
    "Boolean to check if seed asset is to be sent.",
    undefined,
    types.boolean
  )
  .addOptionalParam("gasAmount", "Amount of gas to be sent.", undefined, types.int)
  .addOptionalParam(
    "newEndowGasMoney",
    "Boolean to check if gas money is to be sent.",
    undefined,
    types.boolean
  )
  .addOptionalParam("expiry", "Expiry time for proposals.", undefined, types.int)
  .addOptionalParam("seedAsset", "Address of seed asset.")
  .addOptionalParam("seedAssetAmount", "Amount of seed asset to be sent.", undefined, types.int)
  .addOptionalParam(
    "seedSplitToLiquid",
    "Percentage of seed asset to be sent to liquid.",
    undefined,
    types.int
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Updating CharityApplication config...");

      const addresses = await getAddresses(hre);
      const {charityApplicationsOwners} = await getSigners(hre);

      const charityApplication = CharityApplication__factory.connect(
        addresses.charityApplication.proxy,
        charityApplicationsOwners[0]
      );

      // fetch current config
      logger.out("Querying current config...");
      const struct = await charityApplication.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);

      logger.out("Config data to update:");
      logger.out(taskArgs);

      // update config
      logger.out("Updating config...");
      const updateConfigData = charityApplication.interface.encodeFunctionData("updateConfig", [
        taskArgs.expiry || curConfig.expiry,
        taskArgs.accountsDiamond || curConfig.accountsContract,
        taskArgs.seedSplitToLiquid || curConfig.seedSplitToLiquid,
        taskArgs.newEndowGasMoney || curConfig.newEndowGasMoney,
        taskArgs.gasAmount || curConfig.gasAmount,
        taskArgs.fundSeedAsset || curConfig.fundSeedAsset,
        taskArgs.seedAsset || curConfig.seedAsset,
        taskArgs.seedAssetAmount || curConfig.seedAssetAmount,
      ]);
      const tx = await charityApplicationsOwners[0].submitTransaction(
        charityApplication.address,
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
