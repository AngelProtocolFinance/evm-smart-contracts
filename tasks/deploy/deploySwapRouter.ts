import config from "config";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {accountsDiamond?: string; registrar?: string; verify: boolean};

task("deploy:SwapRouter", "Will deploy SwapRouter contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      await deploySwapRouter(
        registrar,
        accountsDiamond,
        config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
        config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
