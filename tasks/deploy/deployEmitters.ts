import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {accountsDiamond?: string; skipVerify: boolean};

task("deploy:Emitters", "Will deploy Emitters contract")
  .addOptionalParam(
    "accountsDiamond",
    "Accounts Diamond contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;
      const accountsDiamond = taskArgs.accountsDiamond || addresses.accounts.diamond;

      await deployEmitters(accountsDiamond, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
