import config from "config";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

task("deploy:Implementation", "Will deploy Implementation")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addParam("registraraddress", "Registrar contract address")
  .addParam("angelcorestruct", "AngelCoreStruct library address")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      let donationMatchCharityData = {
        reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
        uniswapFactory: addresses.uniswap.factory,
        registrarContract: taskArgs.registraraddress,
        poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
        usdcAddress: addresses.tokens.usdc,
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
