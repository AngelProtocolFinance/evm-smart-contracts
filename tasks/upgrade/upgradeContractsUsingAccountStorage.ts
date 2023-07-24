import {task} from "hardhat/config";
import {confirmAction, logger} from "utils";

task(
  "upgrade:ContractsUsingAccountStorage",
  "Will redeploy all contracts that use AccountStorage struct"
)
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading all contracts using AccountStorage..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      await hre.run("upgrade:CharityApplications", {skipVerify: taskArgs.skipVerify, yes: true});
      await hre.run("upgrade:facets", {
        facets: ["all"],
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
