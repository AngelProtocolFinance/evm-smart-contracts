import {task, types} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/Registrar";
import {confirmAction, getAddresses, getSigners, logger, structToObject} from "utils";

type TaskArgs = Partial<RegistrarMessages.UpdateConfigRequestStruct> & {
  yes: boolean;
};

task("manage:registrar:updateConfig", "Will update Accounts Diamond config")
  .addOptionalParam(
    "accountsContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "splitMax",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "splitMin",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "splitDefault",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.int
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
    "donationMatchCharitesContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "donationMatchEmitter",
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
    "lockedWithdrawal",
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
    "subdaoGovContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subdaoTokenContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subdaoBondingTokenContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subdaoCw900Contract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subdaoDistributorContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "subdaoEmitter",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "donationMatchContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "cw900lvAddress",
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
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    logger.divider();
    logger.out("Updating Registrar config...");

    try {
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      const {yes, ...dirtyConfigValues} = taskArgs;

      const updateConfigRequest = assignDefinedValues(dirtyConfigValues);

      if (Object.keys(updateConfigRequest).length === 0) {
        return logger.out("Nothing to update");
      }

      logger.out("Config data to update:");
      logger.out(updateConfigRequest);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating Registrar config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const registrarContract = Registrar__factory.connect(
        addresses.registrar.proxy,
        apTeamMultisigOwners[0]
      );

      logger.out("Fetching current Registrar's config...");
      const struct = await registrarContract.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);

      const {splitToLiquid, ...otherConfig} = curConfig;
      const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
        {
          ...otherConfig,
          splitMax: splitToLiquid.max,
          splitMin: splitToLiquid.min,
          splitDefault: splitToLiquid.defaultSplit,
          ...updateConfigRequest,
        },
      ]);
      const apTeamMultisigContract = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy,
        apTeamMultisigOwners[0]
      );
      const tx = await apTeamMultisigContract.submitTransaction(
        addresses.registrar.proxy,
        0,
        updateConfigData,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      logger.out("New config:");
      const newStruct = await registrarContract.queryConfig();
      logger.out(structToObject(newStruct));
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

function assignDefinedValues(
  obj: Partial<RegistrarMessages.UpdateConfigRequestStruct>
): Partial<RegistrarMessages.UpdateConfigRequestStruct> {
  const target: Partial<RegistrarMessages.UpdateConfigRequestStruct> = {};

  (Object.keys(obj) as (keyof RegistrarMessages.UpdateConfigRequestStruct)[]).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      target[key] = value as any;
    }
  });

  return target;
}
