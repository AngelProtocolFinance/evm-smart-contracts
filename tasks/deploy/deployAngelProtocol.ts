import config from "config";
import {task} from "hardhat/config";
import {
  ADDRESS_ZERO,
  Deployment,
  confirmAction,
  getSigners,
  isLocalNetwork,
  logger,
  resetAddresses,
  verify,
} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {deployAPTeamMultiSig, deployCharityApplications} from "contracts/multisigs/scripts/deploy";
// import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
// import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {deployVaultEmitter} from "contracts/core/vault/scripts/deployVaultEmitter";
import {getOrDeployThirdPartyContracts, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {prod: boolean; skipVerify: boolean; yes: boolean};

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addFlag("prod", "Run in production mode.")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const {apTeamMultisigOwners, deployer, proxyAdmin, treasury} = await getSigners(hre);

      await resetAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${proxyAdmin.address}`);

      const thirdPartyAddresses = await getOrDeployThirdPartyContracts(proxyAdmin, hre);

      const apTeamMultisig = await deployAPTeamMultiSig(
        apTeamMultisigOwners.map((x) => x.address),
        proxyAdmin,
        hre
      );

      const registrar = await deployRegistrar(
        {
          axelarGateway: thirdPartyAddresses.axelarGateway.address,
          axelarGasService: thirdPartyAddresses.axelarGasService.address,
          router: ADDRESS_ZERO,
          owner: apTeamMultisig.proxy.address,
          deployer,
          proxyAdmin,
          treasury: treasury.address,
          apTeamMultisig: apTeamMultisig.proxy.address,
        },
        hre
      );

      // Router deployment will require updating Registrar config's "router" address
      const router = await deployRouter(registrar.proxy.address, hre);

      const accounts = await deployAccountsDiamond(
        apTeamMultisig.proxy.address,
        registrar.proxy.address,
        hre
      );

      const gasFwd = await deployGasFwd(
        {
          admin: proxyAdmin,
          registrar: registrar.proxy.address,
        },
        hre
      );

      // const emitters = await deployEmitters(accountsDiamond.address, hre);

      const charityApplications = await deployCharityApplications(
        accounts.diamond.address,
        thirdPartyAddresses.seedAsset.address,
        hre
      );

      const indexFund = await deployIndexFund(
        registrar.proxy.address,
        apTeamMultisig.proxy.address,
        hre
      );

      const endowmentMultiSig = await deployEndowmentMultiSig(registrar.proxy.address, hre);

      const vaultEmitter = await deployVaultEmitter(hre);

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
        proxyAdmin: proxyAdmin.address, //address
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
