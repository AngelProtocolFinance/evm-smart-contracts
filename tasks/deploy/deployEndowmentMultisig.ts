import {task} from "hardhat/config";
import {logger} from "utils";

import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addParam("verify", "Want to verify contract")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

      await deployEndowmentMultiSig(isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
