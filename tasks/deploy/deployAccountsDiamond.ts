import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task, types} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  apTeamMultisig?: string;
  registrar?: string;
  verify: boolean;
};

task("deploy:AccountsDiamond", "It will deploy accounts diamond contracts")
  .addOptionalParam(
    "angelCoreStruct",
    "AngelCoreStruct library address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
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

      const angelCoreStruct = taskArgs.angelCoreStruct || addresses.libraries.angelCoreStruct;
      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      await deployAccountsDiamond(
        apTeamMultiSig,
        registrar,
        angelCoreStruct,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    }
  });
