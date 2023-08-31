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

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:SideChain", "Will deploy complete side-chain infrastructure")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
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
        owner: apTeamMultisig.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        skipVerify: verify_contracts,
        yes: true,
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
