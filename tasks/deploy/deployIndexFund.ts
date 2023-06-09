import config from "config";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";

task("deploy:IndexFund", "Will deploy IndexFund contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addParam("registraraddress", "Address of the Registrar contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const {
        multiSig: {apTeam},
      } = await getAddresses(hre);
      const indexFundData = {
        registrarContract: taskArgs.registraraddress,
        fundRotation: config.INDEX_FUND_DATA.fundRotation,
        fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
        fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
      };
      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployIndexFund(indexFundData, apTeam.proxy, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
