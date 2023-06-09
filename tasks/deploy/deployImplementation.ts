import config from "config";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

task("deploy:Implementation", "Will deploy Implementation")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      let donationMatchCharityData = {
        reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
        uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
        registrarContract: taskArgs.registraraddress,
        poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
        usdcAddress: config.DONATION_MATCH_CHARITY_DATA.usdcAddress,
      };

      await deployImplementation(
        taskArgs.angelcorestruct,
        donationMatchCharityData,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
