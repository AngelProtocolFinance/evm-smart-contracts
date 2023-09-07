import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/Registrar";
import {
  confirmAction,
  getAPTeamOwner,
  getAddresses,
  getKeysTyped,
  logger,
  structToObject,
} from "utils";

type TaskArgs = Partial<RegistrarMessages.UpdateConfigRequestStruct> & {
  apTeamSignerPkey?: string;
  yes: boolean;
};

// TODO: update param descriptions
task("manage:registrar:updateConfig", "Will update Accounts Diamond config")
  .addOptionalParam(
    "accountsContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "indexFundContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "govContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "treasury",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "haloToken",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "fundraisingContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "uniswapRouter",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "uniswapFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "multisigFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "multisigEmitter",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "charityApplications",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "proxyAdmin",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "usdcAddress",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "wMaticAddress",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "gasFwdFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    logger.divider();
    logger.out("Updating Registrar config...");

    try {
      const addresses = await getAddresses(hre);

      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const {yes, ...dirtyConfigValues} = taskArgs;

      const updateConfigRequest = assignDefinedValues(dirtyConfigValues);

      if (Object.keys(updateConfigRequest).length === 0) {
        return logger.out("Nothing to update");
      }

      const registrarContract = Registrar__factory.connect(addresses.registrar.proxy, apTeamOwner);

      logger.out("Fetching current Registrar's config...");
      const struct = await registrarContract.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);

      logger.out("Config data to update:");
      logger.out(updateConfigRequest);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating Registrar config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
        {
          ...curConfig,
          ...updateConfigRequest,
        },
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        addresses.registrar.proxy,
        updateConfigData
      );

      if (isExecuted) {
        const newStruct = await registrarContract.queryConfig();
        logger.out("New config:");
        logger.out(structToObject(newStruct));
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

function assignDefinedValues(
  obj: Partial<RegistrarMessages.UpdateConfigRequestStruct>
): Partial<RegistrarMessages.UpdateConfigRequestStruct> {
  const target: Partial<RegistrarMessages.UpdateConfigRequestStruct> = {};

  getKeysTyped(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      target[key] = value as any;
    }
  });

  return target;
}
