import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

type TaskArgs = {
  apTeamMultisig?: string;
  registrar?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:accounts", "It will deploy accounts diamond contracts")
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed = taskArgs.yes || (await confirmAction("Deploying Accounts Diamond..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const addresses = await getAddresses(hre);
      const {deployer} = await getSigners(hre);
      const apTeam = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const registrar = taskArgs.registrar || addresses.registrar.proxy;

      const {diamond, facets} = await deployAccountsDiamond(apTeam, registrar, deployer, hre);

      await hre.run("manage:registrar:updateConfig", {
        accountsContract: diamond.address,
        yes: true,
      });
      await hre.run("manage:CharityApplications:updateConfig", {
        accountsDiamond: diamond.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        for (const deployment of facets) {
          await verify(hre, deployment);
        }
        await verify(hre, diamond);
      }
    } catch (error) {
      logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error);
    }
  });
