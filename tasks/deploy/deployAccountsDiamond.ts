import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig} from "../helpers";

type TaskArgs = {
  apTeamMultisig?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:AccountsDiamond", "It will deploy accounts diamond contracts")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying Accounts Diamond..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);
      const apTeam = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const deployData = await deployAccountsDiamond(apTeam, registrar, hre);

      if (!deployData) {
        return;
      }

      await updateRegistrarConfig(
        registrar,
        apTeam,
        {accountsContract: deployData.diamond.address},
        hre
      );
      await hre.run("manage:CharityApplication:updateConfig", {
        accountsDiamond: deployData.diamond.address,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        for (const deployment of deployData.facets) {
          await verify(hre, deployment);
        }
        await verify(hre, deployData.diamond);
      }
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    }
  });
