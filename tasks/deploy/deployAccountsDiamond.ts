import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task, types} from "hardhat/config";
import {updateRegistrarConfig} from "scripts";
import {confirmAction, getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  apTeamMultisig?: string;
  registrar?: string;
  updateContracts?: boolean;
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
    "updateContracts",
    "Flag indicating whether to upgrade all contracts affected by this deployment",
    undefined, // if no value is set, will ask the caller to confirm the action
    types.boolean
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
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

      // skip this step if explicit `false` is provided
      if (taskArgs.updateContracts === false) {
        return;
      }
      // update the contracts if flag was set to `true` or explicit confirmation is provided
      if (
        taskArgs.updateContracts ||
        (await confirmAction("Updating affected contracts:\n- Registrar.updateConfig\n"))
      ) {
        await updateRegistrarConfig(
          registrar,
          apTeamMultiSig,
          {accountsContract: accountsDiamond.address},
          hre
        );
        await hre.run("manage:CharityApplication:updateConfig", {
          accountsDiamond: accountsDiamond.address,
        });
      }
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    }
  });
