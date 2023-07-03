import {task, types} from "hardhat/config";
import {
  APTeamMultiSig__factory,
  AccountsQueryEndowments__factory,
  AccountsUpdate__factory,
} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {
  earlyLockedWithdrawFeeBps?: number;
  earlyLockedWithdrawFeePayoutAddress?: string;
  maxGeneralCategoryId?: number;
  newRegistrar?: string;
  yes: boolean;
};

task("manage:accounts:updateConfig", "Will update Accounts Diamond config")
  .addOptionalParam(
    "earlyLockedWithdrawFeeBps",
    "Early locked withdraw fee BPS.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "earlyLockedWithdrawFeePayoutAddress",
    "Early locked withdraw fee payout address."
  )
  .addOptionalParam("maxGeneralCategoryId", "The max general category id.", undefined, types.int)
  .addOptionalParam(
    "newRegistrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {yes, ...newConfig} = taskArgs;

      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      logger.out("Querying current config...");
      const accountsQueryEndowments = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeamMultisigOwners[0]
      );
      const {registrarContract, earlyLockedWithdrawFee, maxGeneralCategoryId, owner} =
        await accountsQueryEndowments.queryConfig();
      const curConfig = {registrarContract, earlyLockedWithdrawFee, maxGeneralCategoryId};
      logger.out(curConfig);

      logger.out("Config data to update:");
      logger.out(newConfig);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const accountsUpdate = AccountsUpdate__factory.connect(
        addresses.accounts.diamond,
        apTeamMultisigOwners[0]
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateConfig", [
        newConfig.newRegistrar || curConfig.registrarContract,
        newConfig.maxGeneralCategoryId || curConfig.maxGeneralCategoryId,
        {
          bps: newConfig.earlyLockedWithdrawFeeBps || curConfig.earlyLockedWithdrawFee.bps,
          payoutAddress:
            newConfig.earlyLockedWithdrawFeePayoutAddress ||
            curConfig.earlyLockedWithdrawFee.payoutAddress,
        },
      ]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        owner, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultiSig.submitTransaction(addresses.accounts.diamond, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
