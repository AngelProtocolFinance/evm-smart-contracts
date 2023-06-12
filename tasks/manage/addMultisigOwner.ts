import {task} from "hardhat/config";
import {MultiSigGeneric__factory} from "typechain-types";
import {getSigners, logger} from "utils";

type TaskArgs = {multisig: string; owner: string};

task("manage:addMultisigOwner", "Will add the specified address to the multisig as an owner")
  .addParam("multisig", "Address of multisig")
  .addParam("owner", "Address of the new owner")
  .setAction(async (taskArguments: TaskArgs, hre) => {
    try {
      const {apTeam2} = await getSigners(hre);

      const multisig = MultiSigGeneric__factory.connect(taskArguments.multisig, apTeam2);

      logger.out("Current owners");
      let currentOwners = await multisig.getOwners();
      logger.out(currentOwners);

      logger.out("Adding new owner:");
      logger.out(taskArguments.owner);
      const {data} = await multisig.populateTransaction.addOwner(taskArguments.owner);
      const addOwnerData = hre.ethers.utils.toUtf8Bytes(data!);

      let tx = await multisig.submitTransaction(
        "add owner", //title
        `add ${taskArguments.owner} as owner`, //description
        multisig.address, //destination,
        0, //value
        addOwnerData, //data)
        "0x"
      );
      await hre.ethers.provider.waitForTransaction(tx.hash);

      logger.out("Owner addition successful. New owner list:");
      currentOwners = await multisig.getOwners();
      logger.out(currentOwners);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
