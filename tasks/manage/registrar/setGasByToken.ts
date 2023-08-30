import {BigNumber} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {task, types} from "hardhat/config";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {connectSignerFromPkey, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {gas: number; tokenAddress: string; apTeamSignerPkey?: string};

task("manage:registrar:setGasByToken")
  .addParam("tokenAddress", "Address of the token", "", types.string)
  .addParam(
    "gas",
    "Qty of tokens fwd'd to pay for gas. Make sure to use the correct number of decimals!",
    0,
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

    const {apTeamMultisigOwners} = await getSigners(hre);

    let apTeamSigner: SignerWithAddress;
    if (!apTeamMultisigOwners && taskArguments.apTeamSignerPkey) {
      apTeamSigner = await connectSignerFromPkey(taskArguments.apTeamSignerPkey, hre);
    } else if (!apTeamMultisigOwners) {
      throw new Error("Must provide a pkey for AP Team signer on this network");
    } else {
      apTeamSigner = apTeamMultisigOwners[0];
    }

    const registrar = Registrar__factory.connect(registrarAddress, apTeamSigner);
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
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamSigner
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
