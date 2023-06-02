import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployEndowmentMultiSig(verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
