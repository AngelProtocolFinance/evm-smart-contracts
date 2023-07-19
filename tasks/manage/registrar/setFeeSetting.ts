import {task, types} from "hardhat/config";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

type TaskArgs = {feeType: number; payoutAddress: string, bps: number};

task("manage:registrar:setFeeSettings")
  .addParam("feeType", 
    "The enum of the fee. {0:DEFAULT, 1:HARVEST, 2:WITHDRAWCHARITY, 3:WITHDRAWNORMAL, 4:EARLYLOCKEDWITHDRAWCHARITY, 5:EARLYLOCKEDWITHDRAWNORMAL}",
    0,
    types.int
  )
  .addParam("payoutAddress", "Address of fee recipient", "", types.string)
  .addParam(
    "bps",
    "basis points to be applied for this fee",
    0,
    types.int
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {deployer} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, deployer);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current fee settings");
    let currentFeeSettings = await registrar.getFeeSettingsByFeeType(taskArguments.feeType);
    if (
        (currentFeeSettings.payoutAddress == taskArguments.payoutAddress) && 
        (currentFeeSettings.bps.eq(taskArguments.bps))
      ) {
      logger.pad(10, "Fee settings match desired settings");
      return;
    }

    logger.divider();
    logger.out("Setting fees according to specification");
    await registrar.setFeeSettingsByFeesType(
      taskArguments.feeType,
      taskArguments.bps,
      taskArguments.payoutAddress
    );
  });
