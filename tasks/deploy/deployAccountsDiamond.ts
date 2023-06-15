import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, updateRegistrarConfig} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  apTeamMultisig?: string;
  registrar?: string;
  verify: boolean;
  yes: boolean;
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
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying Accounts Diamond..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);

      const angelCoreStruct = taskArgs.angelCoreStruct || addresses.libraries.angelCoreStruct;
      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const accountsDiamond = await deployAccountsDiamond(
        apTeamMultiSig,
        registrar,
        angelCoreStruct,
        verify_contracts,
        hre
      );

      await updateRegistrarConfig(
        registrar,
        apTeamMultiSig,
        {accountsContract: accountsDiamond.address},
        hre
      );
      await hre.run("manage:CharityApplication:updateConfig", {
        accountsDiamond: accountsDiamond.address,
      });
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    }
  });
