import config from "config";
import {deployFundraising} from "contracts/accessory/fundraising/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:Fundraising", "Will deploy Fundraising contract")
  .addOptionalParam(
    "angelCoreStruct",
    "AngelCoreStruct library address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying Fundraising..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      let FundraisingDataInput = {
        registrarContract: registrar,
        nextId: config.FundraisingDataInput.nextId,
        campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
        taxRate: config.FundraisingDataInput.taxRate,
        acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      };

      await deployFundraising(FundraisingDataInput, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
