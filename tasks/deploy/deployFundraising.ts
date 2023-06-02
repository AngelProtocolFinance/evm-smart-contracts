import config from "config";
import {deployFundraising} from "contracts/accessory/fundraising/scripts/deploy";
import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

task("deploy:Fundraising", "Will deploy Fundraising contract")
  .addParam("verify", "Want to verify contract", false, types.boolean)
  .addParam("registraraddress", "Address of the Registrar contract")
  .addParam("angelcorestruct", "Address of the AngelCoreStruct contract")
  .setAction(async (taskArgs, hre) => {
    try {
      let FundraisingDataInput = {
        registrarContract: taskArgs.registraraddress,
        nextId: config.FundraisingDataInput.nextId,
        campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
        taxRate: config.FundraisingDataInput.taxRate,
        acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      };
      const verify = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployFundraising(FundraisingDataInput, taskArgs.angelcorestruct, verify, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
