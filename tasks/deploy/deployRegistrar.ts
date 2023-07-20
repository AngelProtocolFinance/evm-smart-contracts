import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  apTeamMultisig?: string;
  router?: string;
  skipVerify: boolean;
  yes: boolean;
};

task(
  "deploy:Registrar",
  "Will deploy Registrar contract. Will redeploy Router contract as well as there's no way to update the Router's `registrar` address field."
)
  .addOptionalParam(
    "apTeamMultisig",
    "APTeamMultiSig contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "router",
    "Router contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying Registrar (and Router)..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {treasury, proxyAdmin, deployer} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const oldRouterAddress = taskArgs.router || addresses.router.proxy;

      const registrarDeployment = await deployRegistrar(
        {
          axelarGateway: addresses.axelar.gateway,
          axelarGasService: addresses.axelar.gasService,
          router: oldRouterAddress,
          owner: apTeamMultiSig,
          deployer,
          proxyAdmin,
          treasuryAddress: treasury.address,
        },
        hre
      );

      if (!registrarDeployment) {
        return;
      }

      await updateRegistrarConfig(
        registrarDeployment.address,
        apTeamMultiSig,
        {
          accountsContract: addresses.accounts.diamond,
          splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
          splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
          splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
          collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare,
          gasFwdFactory: addresses.gasFwd.factory,
          indexFundContract: addresses.indexFund.proxy,
          treasury: treasury.address,
          uniswapRouter: addresses.uniswap.swapRouter,
          uniswapFactory: addresses.uniswap.factory,
          multisigFactory: addresses.multiSig.endowment.factory,
          multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
          charityApplications: addresses.multiSig.charityApplications.proxy,
          proxyAdmin: proxyAdmin.address,
          usdcAddress: addresses.tokens.usdc,
          wMaticAddress: addresses.tokens.wmatic,
        },
        hre
      );

      const routerDeployment = await deployRouter(
        addresses.axelar.gateway,
        addresses.axelar.gasService,
        registrarDeployment.address,
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      if (routerDeployment) {
        await updateRegistrarNetworkConnections(
          registrarDeployment.address,
          apTeamMultiSig,
          {router: routerDeployment.address},
          hre
        );
      }

      await hre.run("manage:accounts:updateConfig", {
        newRegistrar: registrarDeployment.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:updateRegistrar", {
        newRegistrar: registrarDeployment.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, registrarDeployment);
        if (routerDeployment) {
          await verify(hre, routerDeployment);
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
