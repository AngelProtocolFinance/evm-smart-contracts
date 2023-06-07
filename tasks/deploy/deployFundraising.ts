import config from "config";
import {task} from "hardhat/config";
import {logger} from "utils";

import {deployFundraising} from "contracts/accessory/fundraising/scripts/deploy";

task("deploy:Fundraising", "Will deploy Fundraising contract")
  .addParam("verify", "Want to verify contract")
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .setAction(async (taskArgs, hre) => {
    try {
      var isTrueSet = taskArgs.verify === "true";
      let FundraisingDataInput = {
        registrarContract: taskArgs.registraraddress,
        nextId: config.FundraisingDataInput.nextId,
        campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
        taxRate: config.FundraisingDataInput.taxRate,
        acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      };

      await deployFundraising(FundraisingDataInput, taskArgs.angelcorestruct, isTrueSet, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
