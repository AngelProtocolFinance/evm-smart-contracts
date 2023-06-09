import {task} from "hardhat/config";
import {logger} from "utils";

task(
  "upgrade:ContractsUsingAccountStorage",
  "Will redeploy all contracts that use AccountStorage struct"
).setAction(async (_taskArguments, hre) => {
  try {
    await hre.run("upgrade:CharityApplication");
    await hre.run("upgrade:facets", {facets: ["all"]});
  } catch (error) {
    logger.out(
      `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
      logger.Level.Error
    );
  }
});
