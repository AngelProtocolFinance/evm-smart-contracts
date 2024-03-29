import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {Registrar__factory} from "typechain-types";
import {AXELAR_NETWORKS, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {accountsDiamond: string; chainName: string; apTeamSignerPkey?: string};

task("manage:registrar:setAccountsChainAndAddress")
  .addParam(
    "accountsDiamond",
    "Address of the accounts contract on target Axelar blockchain",
    undefined,
    cliTypes.address
  )
  .addParam(
    "chainName",
    `The Axelar blockchain name of the accounts contract, possible values: ${AXELAR_NETWORKS.values()
      .filter((chain, i, arr) => arr.indexOf(chain) === i) // filter unique values
      .join(", ")}`
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    if (!AXELAR_NETWORKS.revGet(taskArguments.chainName)) {
      return logger.out(
        `Chain '${taskArguments.chainName}' is not one of the supported Axelar networks`,
        logger.Level.Error
      );
    }

    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];

    const apTeamOwner = await getAPTeamOwner(hre, taskArguments.apTeamSignerPkey);

    const registrar = Registrar__factory.connect(registrarAddress, apTeamOwner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.pad(30, "Setting accounts contract on: ", taskArguments.chainName);
    logger.pad(30, "to contract at: ", taskArguments.accountsDiamond);
    const updateData = registrar.interface.encodeFunctionData("setAccountsContractAddressByChain", [
      taskArguments.chainName,
      taskArguments.accountsDiamond,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
