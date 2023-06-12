import {task, types} from "hardhat/config";
import {deployCommonLibraries} from "scripts";
import {FACET_NAMES_USING_ANGEL_CORE_STRUCT} from "tasks/upgrade/upgradeFacets/constants";
import {confirmAction, isLocalNetwork, logger} from "utils";

type TaskArgs = {upgradeContracts?: boolean; verify: boolean};

task("deploy:Libraries", "Will deploy Libraries")
  .addOptionalParam(
    "upgradeContracts",
    "Flag indicating whether to upgrade all contracts that use these libraries",
    undefined, // if no value is set, will ask the caller to confirm the action
    types.boolean
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const verify_contracts = taskArgs.verify && !isLocalNetwork(hre);
      await deployCommonLibraries(verify_contracts, hre);

      // update contracts that use these libraries if confirmation is provided
      if (taskArgs.upgradeContracts === false) {
        return;
      }
      if (
        taskArgs.upgradeContracts ||
        (await confirmAction("Updating contracts that use these libraries."))
      ) {
        await hre.run("upgrade:facets", {
          facets: FACET_NAMES_USING_ANGEL_CORE_STRUCT,
          verify: taskArgs.verify,
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
