import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {Registrar__factory} from "typechain-types";
import {FeeTypes, getAPTeamOwner, getAddresses, getEnumKeys, logger} from "utils";

type TaskArgs = {feeType: number; payoutAddress: string; bps: number; apTeamSignerPkey?: string};

task("manage:registrar:setFeeSettings")
  .addParam(
    "feeType",
    `The enum of the fee, possible values: ${getEnumKeys(FeeTypes)
      .map((key) => `${key} - ${FeeTypes[key]}`)
      .join(", ")}`,
    0,
    types.int
  )
  .addParam("payoutAddress", "Address of fee recipient", "", types.string)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addParam("bps", "basis points to be applied for this fee", 0, types.int)
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];

    const apTeamOwner = await getAPTeamOwner(hre, taskArguments.apTeamSignerPkey);

    const registrar = Registrar__factory.connect(registrarAddress, apTeamOwner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current fee settings");
    let currentFeeSettings = await registrar.getFeeSettingsByFeeType(taskArguments.feeType);
    if (
      currentFeeSettings.payoutAddress == taskArguments.payoutAddress &&
      currentFeeSettings.bps.eq(taskArguments.bps)
    ) {
      logger.pad(10, "Fee settings match desired settings");
      return;
    }

    logger.divider();
    logger.out("Setting fees according to specification");
    const updateData = registrar.interface.encodeFunctionData("setFeeSettingsByFeesType", [
      taskArguments.feeType,
      taskArguments.bps,
      taskArguments.payoutAddress,
    ]);
    const isExecuted = await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );

    if (!isExecuted) {
      return;
    }

    const newfeeSetting = await registrar.getFeeSettingsByFeeType(taskArguments.feeType);
    if (
      newfeeSetting.payoutAddress !== taskArguments.payoutAddress ||
      !newfeeSetting.bps.eq(taskArguments.bps)
    ) {
      throw new Error(
        `Fee settings were not updated. Expected: ${[
          taskArguments.payoutAddress,
          taskArguments.bps,
        ]}, Got: ${[newfeeSetting.payoutAddress, newfeeSetting.bps]}`
      );
    }
    logger.out("Fee settings updated successfully");
  });
