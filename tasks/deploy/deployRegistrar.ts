import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task, types} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger} from "utils";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "../helpers";

type TaskArgs = {
  apTeamMultisig?: string;
  router?: string;
  verify: boolean;
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
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying Registrar (and Router)..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const {treasury, proxyAdmin} = await getSigners(hre);
      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const oldRouterAddress = taskArgs.router || addresses.router.proxy;
      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const registrar = await deployRegistrar(
        addresses.axelar.gateway,
        addresses.axelar.gasService,
        oldRouterAddress,
        apTeamMultiSig,
        verify_contracts,
        hre
      );

      const router = await deployRouter(
        addresses.axelar.gateway,
        addresses.axelar.gasService,
        registrar.proxy.address,
        verify_contracts,
        hre
      );

      await updateRegistrarConfig(
        registrar.proxy.address,
        apTeamMultiSig,
        {
          accountsContract: addresses.accounts.diamond,
          splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
          splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
          splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
          collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare,
          indexFundContract: addresses.indexFund.proxy,
          treasury: treasury.address,
          applicationsReview: addresses.multiSig.applications.proxy,
          uniswapRouter: addresses.uniswap.swapRouter,
          uniswapFactory: addresses.uniswap.factory,
          multisigFactory: addresses.multiSig.endowment.factory,
          multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
          charityProposal: addresses.charityApplication.proxy,
          proxyAdmin: proxyAdmin.address,
          usdcAddress: addresses.tokens.usdc,
          wMaticAddress: addresses.tokens.wmatic,
        },
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      await updateRegistrarNetworkConnections(
        registrar.proxy.address,
        apTeamMultiSig,
        {router: router.proxy.address},
        hre
      );

      await hre.run("manage:accounts:updateConfig", {
        newRegistrar: registrar.proxy.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:updateOwner", {
        to: registrar.proxy.address,
        yes: true,
      });
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
