import {task} from "hardhat/config";
import {Deployment, confirmAction, isLocalNetwork, logger, verify} from "utils";
import {getSigners, resetAddresses} from "utils";
import {deployAPTeamMultiSig, deployProxyAdmin} from "contracts/multisigs/scripts/deploy";

task("deploy:SideChain", "Will deploy complete side-chain infrastructure")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all side chain contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const {deployer, proxyAdminSigner} = await getSigners(hre);

      await resetAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${deployer.address}`);

      const proxyAdminMultisig = await deployProxyAdmin(hre);

      const apTeamMultisig = await deployAPTeamMultiSig(proxyAdminMultisig.address, hre);

      await hre.run("deploy:LocalRegistrarAndRouter", {
        skipVerify: verify_contracts,
        yes: true,
        owner: apTeamMultisig.proxy.address,
      });

      if (verify_contracts) {
        const deployments: Array<Deployment | undefined> = [
          proxyAdminMultisig,
          apTeamMultisig.implementation,
          apTeamMultisig.proxy,
        ];

        for (const deployment of deployments) {
          if (deployment) {
            await verify(hre, deployment);
          }
        }
      }

      logger.out("Successfully deployed Side Chain contracts.");
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
