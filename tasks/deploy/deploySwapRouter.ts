import {task} from "hardhat/config";
import config from "config";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
import {logger} from "utils";

task("Deploy:SwapRouter", "Will deploy SwapRouter contract")
  .addParam("verify", "Want to verify contract")
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("accountaddress", "Address of the account")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

      await deploySwapRouter(
        taskArgs.registraraddress,
        taskArgs.accountaddress,
        config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
        config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
        isTrueSet,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
