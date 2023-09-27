import {BigNumber} from "ethers";
import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {Registrar__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {gas: number; tokenAddress: string; apTeamSignerPkey?: string};

task("manage:registrar:setGasByToken")
  .addParam("tokenAddress", "Address of the token", undefined, cliTypes.address)
  .addParam(
    "gas",
    "Qty of tokens fwd'd to pay for gas. Make sure to use the correct number of decimals!",
    undefined,
    types.int
  )
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
    logger.out("Checking current gas value");
    let currentGasValue = await registrar.getGasByToken(taskArguments.tokenAddress);
    let desiredGasAsBigNumber = BigNumber.from(taskArguments.gas);
    if (currentGasValue.eq(desiredGasAsBigNumber)) {
      logger.pad(10, "Token gas value is already set to", taskArguments.gas);
      return;
    }

    logger.divider();
    logger.out("Setting gas for specified token");
    const updateData = registrar.interface.encodeFunctionData("setGasByToken", [
      taskArguments.tokenAddress,
      taskArguments.gas,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
