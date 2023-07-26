import {task, types} from "hardhat/config";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {getAddresses, getSigners, structToObject, logger} from "utils";

const NULL_NUMBER = 0;
const NULL_STRING = "";

type TaskArgs = {
  routerAddress: string;
  refundAddress: string;
};

task(
  "manage:registrar:setAPParams",
  "Set any or all of the AP params. This task only modifies specified optional args"
)
  .addOptionalParam("routerAddress", "The address of this chains router", NULL_STRING, types.string)
  .addOptionalParam(
    "refundAddress",
    "The address of this chains fallback refund collector",
    NULL_STRING,
    types.string
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];
    const {apTeamMultisigOwners} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, apTeamMultisigOwners[0]);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Fetching current AP params...");
    let currentAPParams = await registrar.getAngelProtocolParams();
    logger.pad(50, "Current router address: ", currentAPParams.routerAddr);
    logger.pad(50, "Current refund address: ", currentAPParams.refundAddr);

    logger.divider();
    let newRouterAddress = checkIfDefaultAndSet(
      taskArguments.routerAddress,
      currentAPParams.routerAddr
    );
    let newRefundAddress = checkIfDefaultAndSet(
      taskArguments.refundAddress,
      currentAPParams.refundAddr
    );

    logger.out("Setting AP params to:");
    logger.pad(50, "New router address: ", newRouterAddress);
    logger.pad(50, "New refund address: ", newRefundAddress);
    const updateData = registrar.interface.encodeFunctionData("setAngelProtocolParams", [
      {
        routerAddr: newRouterAddress,
        refundAddr: newRefundAddress,
      },
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
    logger.out("Updated AP params:");
    const newStruct = await registrar.getAngelProtocolParams();
    const newAPParams = structToObject(newStruct);
    logger.out(newAPParams);
  });

function checkIfDefaultAndSet(taskArg: any, currentValue: any) {
  let defaultValue: any;
  if (typeof (taskArg == Number)) {
    defaultValue = NULL_NUMBER;
  } else {
    defaultValue = NULL_STRING;
  }
  if (taskArg == defaultValue) {
    return currentValue;
  } else if (taskArg == currentValue) {
    return currentValue;
  } else {
    return taskArg;
  }
}
