import config from "config";
import {task} from "hardhat/config";
import {
  ADDRESS_ZERO,
  Deployment,
  confirmAction,
  getAddresses,
  getSigners,
  connectSignerFromPkey,
  isLocalNetwork,
  logger,
  resetContractAddresses,
  verify,
} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {
  deployAPTeamMultiSig,
  deployProxyAdminMultisig,
  deployCharityApplications,
} from "contracts/multisigs/scripts/deploy";
import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {deployVaultEmitter} from "contracts/core/vault/scripts/deployVaultEmitter";
import {getOrDeployThirdPartyContracts, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  skipVerify: boolean; 
  yes: boolean; 
  newProxyAdmin: boolean; 
  proxyAdminPkey?: string
};

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addFlag("newProxyAdmin", "Whether or not to deploy a new proxyAdmin multisig")
  .addOptionalParam("proxyAdminPkey", "The pkey for the prod proxy amdin multisig")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      let {deployer, proxyAdminSigner, treasury} = await getSigners(hre);
      if(!proxyAdminSigner && taskArgs.proxyAdminPkey) {
        proxyAdminSigner = await connectSignerFromPkey(taskArgs.proxyAdminPkey, hre);
      }
      else if(!proxyAdminSigner) {
        throw new Error("Must provide a pkey for proxyAdmin signer on this network");
      }

      // Get previously deployed contracts 
      const currentAddresses = await getAddresses(hre);
      // Reset the contract address object for all contracts that will be deployed here 
      await resetContractAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${deployer.address}`);

      const proxyAdminMultisig: Deployment = taskArgs.newProxyAdmin
        ? await deployProxyAdminMultisig(proxyAdminSigner, hre)
        : {address: currentAddresses.multiSig.proxyAdmin, contractName: "ProxyAdmin"};

      const thirdPartyAddresses = await getOrDeployThirdPartyContracts(deployer, hre);

      const apTeamMultisig = await deployAPTeamMultiSig(proxyAdminMultisig.address, hre);

      const registrar = await deployRegistrar(
        {
          axelarGateway: thirdPartyAddresses.axelarGateway.address,
          axelarGasService: thirdPartyAddresses.axelarGasService.address,
          router: ADDRESS_ZERO,
          owner: apTeamMultisig.proxy.address,
          deployer,
          proxyAdmin: proxyAdminMultisig.address,
          treasury: treasury.address,
          apTeamMultisig: apTeamMultisig.proxy.address,
        },
        hre
      );

      // Router deployment will require updating Registrar config's "router" address
      const router = await deployRouter(registrar.proxy.address, proxyAdminMultisig.address, hre);

      const accounts = await deployAccountsDiamond(
        proxyAdminMultisig.address,
        registrar.proxy.address,
        hre
      );

      const gasFwd = await deployGasFwd(
        {
          deployer: deployer,
          admin: proxyAdminMultisig.address,
          factoryOwner: apTeamMultisig.proxy.address,
          registrar: registrar.proxy.address,
        },
        hre
      );

      // const emitters = await deployEmitters(accountsDiamond.address, hre);

      const charityApplications = await deployCharityApplications(
        accounts.diamond.address,
        proxyAdminMultisig.address,
        thirdPartyAddresses.seedAsset.address,
        hre
      );

      const indexFund = await deployIndexFund(
        registrar.proxy.address,
        apTeamMultisig.proxy.address,
        proxyAdminMultisig.address,
        hre
      );

      const endowmentMultiSig = await deployEndowmentMultiSig(
        registrar.proxy.address,
        proxyAdminMultisig.address,
        hre
      );

      const vaultEmitter = await deployVaultEmitter(proxyAdminMultisig.address, hre);

      await hre.run("manage:registrar:updateConfig", {
        accountsContract: accounts.diamond.address, //Address
        collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
        indexFundContract: indexFund.proxy.address, //address
        treasury: treasury.address,
        uniswapRouter: thirdPartyAddresses.uniswap.swapRouter.address, //address
        uniswapFactory: thirdPartyAddresses.uniswap.factory.address, //address
        multisigFactory: endowmentMultiSig.factory.address, //address
        multisigEmitter: endowmentMultiSig.emitter.proxy.address, //address
        charityApplications: charityApplications.proxy.address, //address
        proxyAdmin: proxyAdminMultisig.address, //address
        usdcAddress: thirdPartyAddresses.usdcToken.address,
        wMaticAddress: thirdPartyAddresses.wmaticToken.address,
        gasFwdFactory: gasFwd.factory.address,
        yes: true,
      });
      await hre.run("manage:registrar:setVaultEmitterAddress", {
        vaultEmitter: vaultEmitter.proxy.address,
        yes: true,
      });

      // Registrar NetworkInfo's Router address must be updated for the current network
      await updateRegistrarNetworkConnections(
        registrar.proxy.address,
        apTeamMultisig.proxy.address,
        {router: router.proxy.address},
        hre
      );

      if (verify_contracts) {
        const deployments: Array<Deployment> = [
          apTeamMultisig.implementation,
          apTeamMultisig.proxy,
          proxyAdminMultisig,
          registrar.implementation,
          registrar.proxy,
          router.implementation,
          router.proxy,
          accounts.diamond,
          ...accounts.facets,
          charityApplications.implementation,
          charityApplications.proxy,
          indexFund.implementation,
          indexFund.proxy,
          endowmentMultiSig.emitter.implementation,
          endowmentMultiSig.emitter.proxy,
          endowmentMultiSig.factory,
          endowmentMultiSig.implementation,
          gasFwd.factory,
          gasFwd.implementation,
          vaultEmitter.implementation,
          vaultEmitter.proxy,
        ];

        for (const deployment of deployments) {
          await verify(hre, deployment);
        }
      }

      logger.out(
        `Successfully deployed ${
          verify_contracts ? "and verified " : ""
        }Angel Protocol contracts on ${hre.network.name}.`
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
