import {task} from "hardhat/config";
import {Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

type TaskArgs = {accountsDiamond: string; chainName: string};

task("manage:registrar:setAccountsChainAndAddress")
  .addParam("accountsDiamond", "Address of the accounts contract on target Axelar blockchain")
  .addParam("chainName", "The Axelar blockchain name of the accounts contract")
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {deployer} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, deployer);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.pad(30, "Setting accounts contract on: ", taskArguments.chainName);
    logger.pad(30, "to contract at: ", taskArguments.accountsDiamond);
    await registrar.setAccountsContractAddressByChain(
      taskArguments.chainName,
      taskArguments.accountsDiamond
    );
  });
