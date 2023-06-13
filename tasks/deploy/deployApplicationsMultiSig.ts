import {deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  updateContracts?: boolean;
  verify: boolean;
};

task("deploy:ApplicationsMultiSig", "Will deploy ApplicationsMultiSig contract")
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
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      const applicationsMultisig = await deployApplicationsMultiSig(verify_contracts, hre);

      // skip this step if explicit `false` is provided
      if (taskArgs.updateContracts === false) {
        return;
      }
      // update the contracts if flag was set to `true` or explicit confirmation is provided
      if (
        taskArgs.updateContracts ||
        (await confirmAction("Updating affected contracts:\n- Registrar.updateConfig\n"))
      ) {
        await hre.run("manage:charityApplication:updateConfig", {
          applicationsMultisig: applicationsMultisig.proxy.address,
        });
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
