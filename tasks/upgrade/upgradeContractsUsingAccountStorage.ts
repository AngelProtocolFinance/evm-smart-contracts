import {task, types} from "hardhat/config";
import {logger} from "utils";

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
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      await hre.run("upgrade:CharityApplication", {verify: taskArgs.verify});
      await hre.run("upgrade:facets", {facets: ["all"], verify: taskArgs.verify});
    } catch (error) {
      logger.out(
        `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
        logger.Level.Error
      );
    }
  });
