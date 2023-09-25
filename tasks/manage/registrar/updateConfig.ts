import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
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
    cliTypes.address
  )
  .addOptionalParam(
    "indexFundContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "govContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "treasury",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "haloToken",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "fundraisingContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "uniswapRouter",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "uniswapFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "multisigFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "multisigEmitter",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "charityApplications",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "proxyAdmin",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "usdcAddress",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "wMaticAddress",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "gasFwdFactory",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out("Updating Registrar config...");

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

      const isConfirmed = taskArgs.yes || (await confirmAction());
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
