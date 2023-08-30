import {task} from "hardhat/config";
import {Deployment, confirmAction, isLocalNetwork, logger, verify} from "utils";
import {connectSignerFromPkey, getSigners, resetContractAddresses} from "utils";
import {deployAPTeamMultiSig, deployProxyAdminMultisig} from "contracts/multisigs/scripts/deploy";

task("deploy:SideChain", "Will deploy complete side-chain infrastructure")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy admin multisig")
  .setAction(
    async (taskArgs: {skipVerify: boolean; yes: boolean; proxyAdminPkey?: string}, hre) => {
      try {
        const isConfirmed =
          taskArgs.yes || (await confirmAction("Deploying all side chain contracts..."));
        if (!isConfirmed) {
          return logger.out("Confirmation denied.", logger.Level.Warn);
        }

        const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

        let {deployer, proxyAdminSigner} = await getSigners(hre);
        if (!proxyAdminSigner && taskArgs.proxyAdminPkey) {
          proxyAdminSigner = await connectSignerFromPkey(taskArgs.proxyAdminPkey, hre);
        } else if (!proxyAdminSigner) {
          throw new Error("Must provide a pkey for proxyAdmin signer on this network");
        }

        await resetContractAddresses(hre);

        logger.out(`Deploying the contracts with the account: ${deployer.address}`);

        const proxyAdminMultisig = await deployProxyAdminMultisig(
          [proxyAdminSigner.address],
          deployer,
          hre
        );

        const apTeamMultisig = await deployAPTeamMultiSig(
          proxyAdminMultisig.address,
          deployer,
          hre
        );

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
    }
  );
