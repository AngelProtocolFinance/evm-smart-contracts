import config from "config";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployFundraising} from "contracts/accessory/fundraising/scripts/deploy";

task("deploy:Fundraising", "Will deploy Fundraising contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .setAction(async (taskArgs, hre) => {
    try {
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      let FundraisingDataInput = {
        registrarContract: taskArgs.registraraddress,
        nextId: config.FundraisingDataInput.nextId,
        campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
        taxRate: config.FundraisingDataInput.taxRate,
        acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      };

      await deployFundraising(
        FundraisingDataInput,
        taskArgs.angelcorestruct,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
