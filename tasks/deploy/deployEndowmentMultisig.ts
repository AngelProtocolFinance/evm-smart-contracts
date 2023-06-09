import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";

task("deploy:EndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      await deployEndowmentMultiSig(verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
