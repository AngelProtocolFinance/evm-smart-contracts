import {task, types} from "hardhat/config";
import {FACET_NAMES_USING_ANGEL_CORE_STRUCT} from "tasks/upgrade/upgradeFacets/constants";
import {confirmAction, isLocalNetwork, logger, verify} from "utils";
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

      const deployData = await deployCommonLibraries(hre);

      if (!deployData) {
        return;
      }

      if (taskArgs.verify && !isLocalNetwork(hre)) {
        await verify(hre, deployData.angelCoreStruct);
        await verify(hre, deployData.stringLib);
      }

      await hre.run("upgrade:facets", {
        angelCoreStruct: deployData.angelCoreStruct.address,
        facets: FACET_NAMES_USING_ANGEL_CORE_STRUCT,
        verify: taskArgs.verify,
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
