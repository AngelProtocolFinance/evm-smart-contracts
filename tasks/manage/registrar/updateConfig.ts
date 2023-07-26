import {task, types} from "hardhat/config";
import {updateRegistrarConfig} from "tasks/helpers";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/Registrar";
import {confirmAction, getAddresses, logger} from "utils";

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
    "collectorShare",
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
    "haloTokenLpContract",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "charitySharesContract",
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
    try {
      const {yes, ...newConfig} = taskArgs;

      logger.divider();
      const addresses = await getAddresses(hre);

      const cleanConfig = assignDefinedValues(newConfig);

      if (Object.keys(cleanConfig).length === 0) {
        return logger.out("Nothing to update");
      }

      logger.out("Config data to update:");
      logger.out(cleanConfig);

      const isConfirmed = taskArgs.yes || (await confirmAction(`Updating Registrar config...`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      await updateRegistrarConfig(
        addresses.registrar.proxy,
        addresses.multiSig.apTeam.proxy,
        cleanConfig,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

type AnyObject = {[key: string]: any};

function assignDefinedValues<T extends AnyObject>(obj: T): Partial<T> {
  const target: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      target[key] = value;
    }
  }

  return target;
}
