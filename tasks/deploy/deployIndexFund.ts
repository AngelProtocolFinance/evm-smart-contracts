import config from "config";
import {task} from "hardhat/config";
import {getAddresses, logger} from "utils";

import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";

task("deploy:IndexFund", "Will deploy IndexFund contract")
  .addParam("verify", "Want to verify contract")
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
      var isTrueSet = taskArgs.verify === "true";

      await deployIndexFund(indexFundData, apTeam.proxy, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
