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
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
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
      logger.out(JSON.stringify(curConfig, undefined, 2));

      const {yes, ...newConfig} = taskArgs;
      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Update config to:\n${JSON.stringify(newConfig, undefined, 2)}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const accountsUpdate = AccountsUpdate__factory.connect(
        addresses.accounts.diamond,
        apTeamMultisigOwners[0]
      );
      const data = accountsUpdate.interface.encodeFunctionData("updateConfig", [
        taskArgs.newRegistrar || curConfig.registrarContract,
        taskArgs.maxGeneralCategoryId || curConfig.maxGeneralCategoryId,
        {
          bps: taskArgs.earlyLockedWithdrawFeeBps || curConfig.earlyLockedWithdrawFee.bps,
          payoutAddress:
            taskArgs.earlyLockedWithdrawFeePayoutAddress ||
            curConfig.earlyLockedWithdrawFee.payoutAddress,
        },
      ]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        owner, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultiSig.submitTransaction(
        "Accounts Diamond: update config",
        `Update config`,
        addresses.accounts.diamond,
        0,
        data,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
