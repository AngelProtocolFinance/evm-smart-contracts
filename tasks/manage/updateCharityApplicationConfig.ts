import {task, types} from "hardhat/config";
import {
  ApplicationsMultiSig__factory,
  CharityApplication__factory,
  Registrar__factory,
} from "typechain-types";
import {getAddresses, getSigners, logger, verify} from "utils";

type TaskArgs = {
  accountsDiamond?: string;
  applicationsMultisig?: string;
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
    "applicationsMultisig",
    "ApplicationsMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
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
  .addOptionalParam("proposalExpiry", "Expiry time for proposals.", undefined, types.int)
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
      const {applicationsMultisigOwners} = await getSigners(hre);

      const charityApplication = CharityApplication__factory.connect(
        addresses.charityApplication.proxy,
        applicationsMultisigOwners[0]
      );

      // fetch current config
      logger.out("Querying current config...");
      const curConfig = await charityApplication.queryConfig();
      logger.out(JSON.stringify(curConfig, undefined, 2));

      // data setup
      logger.out(`Config data to update:\n${JSON.stringify(taskArgs)}`);
      const updateConfigData = charityApplication.interface.encodeFunctionData("updateConfig", [
        taskArgs.proposalExpiry || curConfig.proposalExpiry,
        taskArgs.applicationsMultisig || addresses.multiSig.applications.proxy,
        taskArgs.accountsDiamond || curConfig.accountsContract,
        taskArgs.seedSplitToLiquid || curConfig.seedSplitToLiquid,
        taskArgs.newEndowGasMoney || curConfig.newEndowGasMoney,
        taskArgs.gasAmount || curConfig.gasAmount,
        taskArgs.fundSeedAsset || curConfig.fundSeedAsset,
        taskArgs.seedAsset || curConfig.seedAsset,
        taskArgs.seedAssetAmount || curConfig.seedAssetAmount,
      ]);

      // update config
      logger.out("Updating config...");
      const applicationMultiSigContract = ApplicationsMultiSig__factory.connect(
        curConfig.applicationMultisig, // we need to use current config's ApplicationsMultiSig address
        applicationsMultisigOwners[0]
      );
      const tx = await applicationMultiSigContract.submitTransaction(
        "CharityApplication: Update Config",
        "CharityApplication: Update Config",
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
