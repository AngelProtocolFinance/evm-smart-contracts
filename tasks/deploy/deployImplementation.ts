import config from "config";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

task("deploy:Implementation", "Will deploy Implementation")
  .addFlag("skipVerify", "Skip contract verification")
  .addParam("registraraddress", "Registrar contract address")
  .addParam("accountaddress", "Address of the Account")
  .addParam("apteammultisigaddress", "Address of the APTeam multisig")
  .addParam("endowmentmultisigaddress", "Address of the Endowment multisig")
  .setAction(async (taskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      let donationMatchCharityData = {
        reserveToken: addresses.tokens.reserveToken,
        uniswapFactory: addresses.uniswap.factory,
        registrarContract: taskArgs.registraraddress,
        poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
        usdcAddress: addresses.tokens.usdc,
      };

      await deployImplementation(donationMatchCharityData, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
