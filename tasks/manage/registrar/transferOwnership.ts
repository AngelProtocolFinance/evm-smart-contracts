import {task} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

task("manage:registrar:transferOwnership")
  .addParam(
    "to",
    "Address of the new owner. Ensure at least one of `apTeamMultisigOwners` is the controller of this address."
  )
  .setAction(async (taskArgs: {to: string}, hre) => {
    try {
      logger.divider();
      logger.out("Connecting to registrar on specified network...");
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);
      const registrar = Registrar__factory.connect(
        addresses.registrar.proxy,
        apTeamMultisigOwners[0]
      );
      logger.pad(50, "Connected to Registrar at: ", registrar.address);

      const curOwner = await registrar.owner();
      logger.pad(50, "Current owner: ", curOwner);

      logger.out("Submitting `transferOwnership` transaction to multisig...");
      const data = registrar.interface.encodeFunctionData("transferOwnership", [taskArgs.to]);
      const apTeamMultiSig = APTeamMultiSig__factory.connect(curOwner, apTeamMultisigOwners[0]);
      const tx = await apTeamMultiSig.submitTransaction(
        "Registrar: transfer ownership",
        `Transfer ownership to ${taskArgs.to}`,
        registrar.address,
        0,
        data,
        "0x"
      );
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
