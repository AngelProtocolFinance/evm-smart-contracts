import {task, types} from "hardhat/config";
import {deployCommonLibraries} from "scripts";
import {FACET_NAMES_USING_ANGEL_CORE_STRUCT} from "tasks/upgrade/upgradeFacets/constants";
import {isLocalNetwork, logger} from "utils";

task("deploy:Libraries", "Will deploy Libraries")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = taskArgs.verify && !isLocalNetwork(hre);

      await deployCommonLibraries(verify_contracts, hre);

      await hre.run("upgrade:facets", {
        facets: FACET_NAMES_USING_ANGEL_CORE_STRUCT,
        verify: taskArgs.verify,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
