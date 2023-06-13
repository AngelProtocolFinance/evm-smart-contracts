import {task, types} from "hardhat/config";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

type TaskArgs = {acceptanceState: boolean; tokenAddress: string};

task("manage:registrar:setTokenAccepted")
  .addParam("tokenAddress", "Address of the token", "", types.string)
  .addParam("acceptanceState", "Boolean for acceptance state", false, types.boolean)
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {deployer} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, deployer);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking token acceptance state");
    let tokenAccepted = await registrar.isTokenAccepted(taskArguments.tokenAddress);
    if (tokenAccepted == taskArguments.acceptanceState) {
      logger.out("Token acceptance is already set");
      return;
    }
    logger.pad(30, "Token acceptance is currently set to", tokenAccepted);

    logger.divider();
    logger.out("Setting token acceptance");
    await registrar.setTokenAccepted(taskArguments.tokenAddress, taskArguments.acceptanceState);
  });
