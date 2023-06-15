import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {accountsDiamond?: string; verify: boolean};

task("deploy:Emitters", "Will deploy Emitters contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;

      await deployEmitters(accountsDiamond, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
