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
import {deployAPTeamMultiSig, deployCharityApplications} from "contracts/multisigs/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
// import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
// import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {getOrDeployThirdPartyContracts, updateRegistrarNetworkConnections} from "../helpers";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: {skipVerify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const {deployer, proxyAdmin, treasury} = await getSigners(hre);

      await resetAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${proxyAdmin.address}`);

      const thirdPartyAddresses = await getOrDeployThirdPartyContracts(proxyAdmin, hre);

      const apTeamMultisig = await deployAPTeamMultiSig(hre);

      const registrar = await deployRegistrar(
        {
          axelarGateway: thirdPartyAddresses.axelarGateway.address,
          axelarGasService: thirdPartyAddresses.axelarGasService.address,
          router: ADDRESS_ZERO,
          owner: apTeamMultisig?.address,
          deployer,
          proxyAdmin,
          treasury: treasury.address,
        },
        hre
      );

      // Router deployment will require updating Registrar config's "router" address
      const router = await deployRouter(registrar?.address, hre);

      const accounts = await deployAccountsDiamond(
        apTeamMultisig?.address,
        registrar?.address,
        hre
      );

      const gasFwd = await deployGasFwd(
        {
          admin: proxyAdmin,
          registrar: registrar?.address,
        },
        hre
      );

      // const emitters = await deployEmitters(accountsDiamond.address, hre);

      const charityApplications = await deployCharityApplications(
        accounts?.diamond.address,
        thirdPartyAddresses.seedAsset.address,
        hre
      );

      const indexFund = await deployIndexFund(registrar?.address, apTeamMultisig?.address, hre);

      const endowmentMultiSig = await deployEndowmentMultiSig(registrar?.address, hre);

      await hre.run("manage:registrar:updateConfig", {
        accountsContract: accounts?.diamond.address, //Address
        splitMax: config.REGISTRAR_DATA.splitToLiquid.max, //uint256
        splitMin: config.REGISTRAR_DATA.splitToLiquid.min, //uint256
        splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit, //uint256
        collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
        indexFundContract: indexFund?.address, //address
        treasury: treasury.address,
        uniswapRouter: thirdPartyAddresses.uniswap.swapRouter.address, //address
        uniswapFactory: thirdPartyAddresses.uniswap.factory.address, //address
        multisigFactory: endowmentMultiSig?.factory.address, //address
        multisigEmitter: endowmentMultiSig?.emitter.address, //address
        charityApplications: charityApplications?.address, //address
        proxyAdmin: proxyAdmin.address, //address
        usdcAddress: thirdPartyAddresses.usdcToken.address,
        wMaticAddress: thirdPartyAddresses.wmaticToken.address,
        gasFwdFactory: gasFwd?.factory.address,
        yes: true,
      });

      // Registrar NetworkInfo's Router address must be updated for the current network
      if (router) {
        await updateRegistrarNetworkConnections(
          registrar?.address,
          apTeamMultisig?.address,
          {router: router.address},
          hre
        );
      }

      if (verify_contracts) {
        const deployments: Array<Deployment | undefined> = [
          apTeamMultisig,
          registrar,
          router,
          accounts?.diamond,
          ...(accounts?.facets || []),
          charityApplications,
          indexFund,
          endowmentMultiSig?.emitter,
          endowmentMultiSig?.factory,
          endowmentMultiSig?.implementation,
          gasFwd?.factory,
          gasFwd?.implementation,
        ];

        for (const deployment of deployments) {
          if (deployment) {
            await verify(hre, deployment);
          }
        }
      }

      logger.out("Successfully deployed Angel Protocol contracts.");
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
