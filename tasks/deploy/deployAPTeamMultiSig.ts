import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, isLocalNetwork, logger} from "utils";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying APTeamMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;
      const apTeamMultiSig = await deployAPTeamMultiSig(verify_contracts, hre);

      if (!apTeamMultiSig) {
        return;
      }

      await hre.run("manage:registrar:transferOwnership", {
        to: apTeamMultiSig.address,
        yes: true,
      });
      await hre.run("manage:AccountsDiamond:updateOwner", {
        to: apTeamMultiSig.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:updateOwner", {
        to: apTeamMultiSig.address,
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
