import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:SubdaoEmitter", "Will deploy SubdaoEmitter contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .addParam("accountaddress", "Address of the account")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployEmitters(taskArgs.accountaddress, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
