import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {Registrar__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {operator: string; approved: boolean; apTeamSignerPkey?: string};

task("manage:registrar:setVaultOperatorStatus")
  .addParam("operator", "Address of the vault operator", undefined, cliTypes.address)
  .addParam("approved", "The new approval state of the operator", undefined, types.boolean)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const apTeamOwner = await getAPTeamOwner(hre, taskArguments.apTeamSignerPkey);

    const registrar = Registrar__factory.connect(registrarAddress, apTeamOwner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.pad(30, "Setting operator approval state for: ", taskArguments.operator);
    logger.pad(30, "to: ", taskArguments.approved);
    const updateData = registrar.interface.encodeFunctionData("setVaultOperatorApproved", [
      taskArguments.operator,
      taskArguments.approved,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
