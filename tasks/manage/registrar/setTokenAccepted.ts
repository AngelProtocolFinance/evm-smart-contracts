import {task, types} from "hardhat/config";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
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
    const {apTeamMultisigOwners} = await getSigners(hre);
    const registrar = Registrar__factory.connect(registrarAddress, apTeamMultisigOwners[0]);
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
    const updateData = registrar.interface.encodeFunctionData("setTokenAccepted", [
      taskArguments.tokenAddress,
      taskArguments.acceptanceState,
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
  });
