import config from "config";
import {deployFundraising} from "contracts/accessory/fundraising/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {angelCoreStruct?: string; registrar?: string; verify: boolean};

task("deploy:Fundraising", "Will deploy Fundraising contract")
  .addOptionalParam(
    "angelCoreStruct",
    "AngelCoreStruct library address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const angelCoreStruct =
        taskArgs.angelCoreStruct || addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      let FundraisingDataInput = {
        registrarContract: registrar,
        nextId: config.FundraisingDataInput.nextId,
        campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
        taxRate: config.FundraisingDataInput.taxRate,
        acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      };

      await deployFundraising(FundraisingDataInput, angelCoreStruct, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
