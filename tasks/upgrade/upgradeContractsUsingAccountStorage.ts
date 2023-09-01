import {task} from "hardhat/config";
import {confirmAction, logger} from "utils";

type TaskArgs = {proxyAdminPkey?: string; skipVerify: boolean; yes: boolean};

task(
  "upgrade:ContractsUsingAccountStorage",
  "Will redeploy all contracts that use AccountStorage struct"
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading all contracts using AccountStorage..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      await hre.run("upgrade:CharityApplications", {
        proxyAdminPkey: taskArgs.proxyAdminPkey,
        skipVerify: taskArgs.skipVerify,
        yes: true,
      });
      await hre.run("upgrade:facets", {
        facets: ["all"],
        proxyAdminPkey: taskArgs.proxyAdminPkey,
        skipVerify: taskArgs.skipVerify,
        yes: true,
      });
    } catch (error) {
      logger.out(
        `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
        logger.Level.Error
      );
    }
  });
