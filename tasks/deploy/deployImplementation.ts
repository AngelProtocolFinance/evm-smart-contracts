import config from "config";
import {task} from "hardhat/config";
import {logger} from "utils";

import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

task("deploy:Implementation", "Will deploy Implementation")
  .addParam("verify", "Want to verify contract")
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";

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
        isTrueSet,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
