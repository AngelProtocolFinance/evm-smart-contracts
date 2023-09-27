import {CONFIG} from "config";
import {deployAPTeamMultiSig, deployProxyAdminMultisig} from "contracts/multisigs/scripts/deploy";
import {ContractFactory} from "ethers";
import {task} from "hardhat/config";
import {getOrDeployThirdPartyContracts} from "tasks/helpers";
import {ChainID, Deployment} from "types";
import {
  confirmAction,
  getAddresses,
  getAddressesByNetworkId,
  getNetworkNameFromChainId,
  getPrimaryChainId,
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
        ? await Promise.all(proxyAdminMultisigOwners.map((x) => x.getAddress()))
        : CONFIG.PROD_CONFIG.ProxyAdminMultiSigOwners;

      await resetContractAddresses(hre);

      await getOrDeployThirdPartyContracts(deployer, hre);

      logger.out(`Deploying the contracts with the account: ${await deployer.getAddress()}`);

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


      // Configure the registrar 
      const primaryChainId = await getPrimaryChainId(hre);
      const primaryChainName = getNetworkNameFromChainId(primaryChainId);
      const primaryAddresses = getAddressesByNetworkId(primaryChainId);
      const addresses = await getAddresses(hre);

      await hre.run("manage:registrar:setAccountsChainAndAddress", {
        accountsDiamond: primaryAddresses.accounts.diamond,
        chainName: primaryChainName,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
      });

      await hre.run("manage:registrar:setTokenAccepted", {
        tokenAddress: addresses.tokens.usdc,
        acceptanceState: true,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
      });

      await hre.run("manage:registrar:updateNetworkConnections", {
        chainId: primaryChainId,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      await hre.run("manage:registrar:setVaultOperatorStats", {
        operator: addresses.router.proxy,
        approved: true,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
      });

      await hre.run("manage:registrar:setAllFeeSettings", {
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
      });

      // Verify if needed 
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
