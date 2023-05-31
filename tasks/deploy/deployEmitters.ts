import {task} from "hardhat/config";
import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {logger} from "utils";

task("Deploy:Emitters", "Will deploy Emitters contract")
  .addParam("verify", "Want to verify contract")
  .addParam("accountaddress", "Address of the account")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

      await deployEmitters(taskArgs.accountaddress, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
