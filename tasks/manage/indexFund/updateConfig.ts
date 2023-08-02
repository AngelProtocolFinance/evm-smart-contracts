import {task} from "hardhat/config";
import {APTeamMultiSig__factory, IndexFund__factory} from "typechain-types";
import {confirmAction, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {
  newConfig: {registrarContract: string; fundingGoal: number; fundingRotation: number};
  yes: boolean;
};

task("manage:IndexFund:updateConfig", "Will update the config of the IndexFund")
  .addParam(
    "newConfig",
    "New Config. Registrar Contract address, funding rotation blocks & funding goal amount."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      let newConfig = taskArgs.newConfig;

      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      logger.out("Querying current IndexFund registrar...");
      const indexFund = IndexFund__factory.connect(
        addresses.indexFund.proxy,
        apTeamMultisigOwners[0]
      );

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Update Registrar address to: ${newConfig.registrarContract}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy, // ensure connection to current owning APTeamMultiSig contract
        apTeamMultisigOwners[0]
      );
      const data = indexFund.interface.encodeFunctionData("updateConfig", [
        newConfig.registrarContract,
        newConfig.fundingRotation,
        newConfig.fundingGoal,
      ]);
      const tx = await apTeamMultiSig.submitTransaction(indexFund.address, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
