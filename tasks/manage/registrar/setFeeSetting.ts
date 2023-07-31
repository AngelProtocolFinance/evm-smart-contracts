import {task, types} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {FeeTypes, getAddresses, getEnumKeys, getSigners, logger} from "utils";

type TaskArgs = {feeType: number; payoutAddress: string; bps: number};

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
  .addParam("bps", "basis points to be applied for this fee", 0, types.int)
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {apTeamMultisigOwners} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, apTeamMultisigOwners[0]);
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
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamMultisigOwners[0]
    );
    const tx = await apTeamMultisigContract.submitTransaction(
      registrar.address,
      0,
      updateData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    const newfeeSetting = await registrar.getFeeSettingsByFeeType(taskArguments.feeType);
    if (
      newfeeSetting.payoutAddress == taskArguments.payoutAddress &&
      newfeeSetting.bps.eq(taskArguments.bps)
    ) {
      logger.out("Fee settings updated successfully");
    } else {
      throw new Error(
        `Fee settings were not updated. Expected: ${[
          taskArguments.payoutAddress,
          taskArguments.bps,
        ]}, Got: ${[newfeeSetting.payoutAddress, newfeeSetting.bps]}`
      );
    }
  });
