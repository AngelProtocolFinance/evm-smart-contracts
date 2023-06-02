import {task, types} from "hardhat/config";
import config from "config";
import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";
import {isLocalNetwork, logger} from "utils";

task("deploy:Implementation", "Will deploy Implementation")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;

      let donationMatchCharityData = {
        reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
        uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
        registrarContract: taskArgs.registraraddress,
        poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
        usdcAddress: config.DONATION_MATCH_CHARITY_DATA.usdcAddress,
      };

      await deployImplementation(taskArgs.angelcorestruct, donationMatchCharityData, verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
