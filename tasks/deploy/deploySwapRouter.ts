import config from "config";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:SwapRouter", "Will deploy SwapRouter contract")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("accountaddress", "Address of the account")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deploySwapRouter(
        taskArgs.registraraddress,
        taskArgs.accountaddress,
        config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
        config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
