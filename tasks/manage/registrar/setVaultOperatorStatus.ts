import {task} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {operator: string; status: boolean; apTeamSignerPkey?: string};

task("manage:registrar:setVaultOperatorStatus")
  .addParam("operator", "Address of the vault operator")
  .addParam("status", "The state to set the operator to")
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
    logger.pad(30, "Setting orpeator status for: ", taskArguments.operator);
    logger.pad(30, "to: ", taskArguments.status);
    const updateData = registrar.interface.encodeFunctionData("setVaultOperatorApproved", [
      taskArguments.operator,
      taskArguments.status,
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner
    );
    const tx = await apTeamMultisigContract.submitTransaction(
      registrar.address,
      0,
      updateData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();
  });
