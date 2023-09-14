import {CONFIG} from "config";
import {deployAPTeamMultiSig, deployProxyAdminMultisig} from "contracts/multisigs/scripts/deploy";
import {ContractFactory} from "ethers";
import {task} from "hardhat/config";
import {getOrDeployThirdPartyContracts} from "tasks/helpers";
import {Deployment} from "types";
import {
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

      let {deployer, proxyAdminMultisigOwners} = await getSigners(hre);

      const proxyAdminMultisigOwnerAddresses = proxyAdminMultisigOwners
        ? proxyAdminMultisigOwners.map((x) => x.address)
        : CONFIG.PROD_CONFIG.ProxyAdminMultiSigOwners;

      await resetContractAddresses(hre);

      await getOrDeployThirdPartyContracts(deployer, hre);

      logger.out(`Deploying the contracts with the account: ${deployer.address}`);

      const proxyAdminMultisig = await deployProxyAdminMultisig(
        proxyAdminMultisigOwnerAddresses,
        deployer,
        hre
      );

      const apTeamMultisig = await deployAPTeamMultiSig(
        proxyAdminMultisig.contract.address,
        deployer,
        hre
      );

      await hre.run("deploy:LocalRegistrarAndRouter", {
        owner: apTeamMultisig.proxy.contract.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        skipVerify: taskArgs.skipVerify,
        yes: true,
      });

      await hre.run("deploy:VaultEmitter", {
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        skipVerify: taskArgs.skipVerify,
        yes: true,
      });

      await hre.run("manage:registrar:setAllFeeSettings", {
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        const deployments: Array<Deployment<ContractFactory>> = [
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
