import {task, types} from "hardhat/config";
import {confirmAction, logger} from "utils";

task(
  "upgrade:ContractsUsingAccountStorage",
  "Will redeploy all contracts that use AccountStorage struct"
)
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Upgrading all contracts using AccountStorage..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      await hre.run("upgrade:CharityApplication", {verify: taskArgs.verify, yes: true});
      await hre.run("upgrade:facets", {facets: ["all"], verify: taskArgs.verify, yes: true});
    } catch (error) {
      logger.out(
        `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
        logger.Level.Error
      );
    }
  });
