import config from "config";
import {deployAPTeamMultiSig, deployProxyAdminMultisig} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {
  Deployment,
  confirmAction,
  getSigners,
  isLocalNetwork,
  logger,
  resetContractAddresses,
  verify,
} from "utils";

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

      let {deployer, proxyAdminMultisigOwners} = await getSigners(hre);

      const proxyAdminMultisigOwnerAddresses = proxyAdminMultisigOwners
        ? proxyAdminMultisigOwners.map((x) => x.address)
        : config.PROD_CONFIG.ProxyAdminMultiSigOwners;

      await resetContractAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${deployer.address}`);

      const proxyAdminMultisig = await deployProxyAdminMultisig(
        proxyAdminMultisigOwnerAddresses,
        deployer,
        hre
      );

      const apTeamMultisig = await deployAPTeamMultiSig(proxyAdminMultisig.address, deployer, hre);

      await hre.run("deploy:LocalRegistrarAndRouter", {
        skipVerify: verify_contracts,
        yes: true,
        owner: apTeamMultisig.proxy.address,
      });

      if (verify_contracts) {
        const deployments: Array<Deployment> = [
          proxyAdminMultisig,
          apTeamMultisig.implementation,
          apTeamMultisig.proxy,
        ];

        for (const deployment of deployments) {
          await verify(hre, deployment);
        }
      }

      logger.out("Successfully deployed Side Chain contracts.");
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
