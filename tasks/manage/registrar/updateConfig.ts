import {task, types} from "hardhat/config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/Registrar";
import {
  confirmAction,
  connectSignerFromPkey,
  getAddresses,
  getSigners,
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
      const {apTeamMultisigOwners} = await getSigners(hre);

      let apTeamSigner: SignerWithAddress;
      if (!apTeamMultisigOwners && taskArgs.apTeamSignerPkey) {
        apTeamSigner = await connectSignerFromPkey(taskArgs.apTeamSignerPkey, hre);
      } else if (!apTeamMultisigOwners) {
        throw new Error("Must provide a pkey for AP Team signer on this network");
      } else {
        apTeamSigner = apTeamMultisigOwners[0];
      }

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

      const registrarContract = Registrar__factory.connect(addresses.registrar.proxy, apTeamSigner);

      logger.out("Fetching current Registrar's config...");
      const struct = await registrarContract.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);

      const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
        {
          ...curConfig,
          ...updateConfigRequest,
        },
      ]);
      const apTeamMultisigContract = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy,
        apTeamSigner
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
