import {task, types} from "hardhat/config";
import {FACET_NAMES_USING_ANGEL_CORE_STRUCT} from "tasks/upgrade/upgradeFacets/constants";
import {confirmAction, isLocalNetwork, logger} from "utils";
import {deployCommonLibraries} from "../helpers";

task("deploy:Libraries", "Will deploy Libraries")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying common libraries..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = taskArgs.verify && !isLocalNetwork(hre);

      const commonLibraries = await deployCommonLibraries(verify_contracts, hre);

      if (!commonLibraries) {
        return;
      }

      await hre.run("upgrade:facets", {
        facets: FACET_NAMES_USING_ANGEL_CORE_STRUCT,
        verify: taskArgs.verify,
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
