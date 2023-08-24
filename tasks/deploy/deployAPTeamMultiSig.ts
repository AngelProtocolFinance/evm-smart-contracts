import {deployAPTeamMultiSig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getSigners, isLocalNetwork, logger, verify} from "utils";

task("deploy:APTeamMultiSig", "Will deploy APTeamMultiSig contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying APTeamMultiSig..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {apTeamMultisigOwners, proxyAdmin} = await getSigners(hre);

      const apTeamMultiSig = await deployAPTeamMultiSig(
        apTeamMultisigOwners.map((x) => x.address),
        proxyAdmin,
        hre
      );

      await hre.run("manage:registrar:transferOwnership", {
        to: apTeamMultiSig.proxy.address,
        yes: true,
      });
      await hre.run("manage:AccountsDiamond:updateOwner", {
        to: apTeamMultiSig.proxy.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:transferOwnership", {
        to: apTeamMultiSig.proxy.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, apTeamMultiSig.implementation);
        await verify(hre, apTeamMultiSig.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
