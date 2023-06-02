import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployEndowmentMultiSig(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
