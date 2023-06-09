import config from "config";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";

type TaskArgs = {accountsDiamond?: string; registrar?: string; verify: boolean};

task("deploy:SwapRouter", "Will deploy SwapRouter contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addOptionalParam(
    "registrar",
    "Address of the Registrar contract. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "accountsDiamond",
    "Address of the Accounts Diamond contract. Will do a local lookup from contract-address.json if none is provided."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;
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
