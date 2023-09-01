import {task, types} from "hardhat/config";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {APTeamMultiSig__factory, IndexFund__factory} from "typechain-types";
import {
  confirmAction,
  connectSignerFromPkey,
  getAddresses,
  getSigners,
  logger,
  structToObject,
} from "utils";

type TaskArgs = {
  registrarContract: string;
  fundingGoal: number;
  fundRotation: number;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task("manage:IndexFund:updateConfig", "Will update the config of the IndexFund")
  .addOptionalParam(
    "registrarContract",
    "New Registrar contract. Will do a local lookup from contract-address.json if none is provided.funding rotation blocks & funding goal amount."
  )
  .addOptionalParam("fundingGoal", "Funding rotation blocks.", undefined, types.int)
  .addOptionalParam("fundRotation", "Funding goal amount.", undefined, types.int)
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {yes, ...newConfig} = taskArgs;

      logger.divider();
      const addresses = await getAddresses(hre);
      const {apTeamMultisigOwners} = await getSigners(hre);

      let apTeamSigner: SignerWithAddress;
      if (!apTeamMultisigOwners && taskArgs.apTeamSignerPkey) {
        apTeamSigner = await connectSignerFromPkey(taskArgs.apTeamSignerPkey, hre);
      } else if (!apTeamMultisigOwners) {
        throw new Error("Must provide a pkey for AP Team signer on this network");
      } else {
        apTeamSigner = apTeamMultisigOwners[0];
      }

      logger.out("Querying current IndexFund registrar...");
      const indexFund = IndexFund__factory.connect(addresses.indexFund.proxy, apTeamSigner);
      const struct = await indexFund.queryConfig();
      const curConfig = structToObject(struct);
      logger.out(curConfig);

      logger.out("Config data to update:");
      logger.out(newConfig);

      const isConfirmed =
        taskArgs.yes ||
        (await confirmAction(`Update Registrar address to: ${newConfig.registrarContract}`));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      logger.out("Updating config...");
      const apTeamMultiSig = APTeamMultiSig__factory.connect(
        addresses.multiSig.apTeam.proxy, // ensure connection to current owning APTeamMultiSig contract
        apTeamSigner
      );
      const data = indexFund.interface.encodeFunctionData("updateConfig", [
        newConfig.registrarContract || curConfig.registrarContract,
        newConfig.fundRotation || curConfig.fundRotation,
        newConfig.fundingGoal || curConfig.fundingGoal,
      ]);
      const tx = await apTeamMultiSig.submitTransaction(indexFund.address, 0, data, "0x");
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      logger.out("New config:");
      const updatedConfig = await indexFund.queryConfig();
      logger.out(structToObject(updatedConfig));
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
