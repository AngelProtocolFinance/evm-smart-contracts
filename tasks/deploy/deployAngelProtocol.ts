import {CONFIG} from "config";
import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployGasFwd} from "contracts/core/gasFwd/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {deployVaultEmitter} from "contracts/core/vault/scripts/deployVaultEmitter";
import {deployEndowmentMultiSig} from "contracts/multisigs/endowment-multisig/scripts/deploy";
import {
  deployAPTeamMultiSig,
  deployCharityApplications,
  deployProxyAdminMultisig,
} from "contracts/multisigs/scripts/deploy";
import {task} from "hardhat/config";
import {
  ADDRESS_ZERO,
  Deployment,
  confirmAction,
  getSigners,
  isLocalNetwork,
  logger,
  resetContractAddresses,
  verify,
} from "utils";
import {getOrDeployThirdPartyContracts} from "../helpers";

type TaskArgs = {
  apTeamSignerPkey?: string;
  skipVerify: boolean;
  yes: boolean;
};

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addFlag("skipVerify", "Skip contract verification")
  .addFlag("yes", "Automatic yes to prompt.")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      let {deployer, proxyAdminMultisigOwners, treasury} = await getSigners(hre);

      let treasuryAddress = treasury ? treasury.address : CONFIG.PROD_CONFIG.Treasury;

      const proxyAdminMultisigOwnerAddresses = proxyAdminMultisigOwners
        ? proxyAdminMultisigOwners.map((x) => x.address)
        : CONFIG.PROD_CONFIG.ProxyAdminMultiSigOwners;

      // Reset the contract address object for all contracts that will be deployed here
      await resetContractAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${deployer.address}`);

      const proxyAdminMultisig = await deployProxyAdminMultisig(
        proxyAdminMultisigOwnerAddresses,
        deployer,
        hre
      );

      const thirdPartyAddresses = await getOrDeployThirdPartyContracts(deployer, hre);

      const apTeamMultisig = await deployAPTeamMultiSig(proxyAdminMultisig.address, deployer, hre);

      const registrar = await deployRegistrar(
        {
          axelarGateway: thirdPartyAddresses.axelarGateway.address,
          axelarGasService: thirdPartyAddresses.axelarGasService.address,
          router: ADDRESS_ZERO, // will be updated once Router is deployed
          owner: apTeamMultisig.proxy.address,
          deployer,
          proxyAdmin: proxyAdminMultisig.address,
          treasury: treasuryAddress,
          apTeamMultisig: apTeamMultisig.proxy.address,
        },
        hre
      );

      const router = await deployRouter(
        registrar.proxy.address,
        proxyAdminMultisig.address,
        deployer,
        hre
      );

      const accounts = await deployAccountsDiamond(
        apTeamMultisig.proxy.address,
        registrar.proxy.address,
        proxyAdminMultisig.address,
        deployer,
        hre
      );

      const gasFwd = await deployGasFwd(
        {
          deployer: deployer,
          proxyAdmin: proxyAdminMultisig.address,
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
        deployer,
        hre
      );

      const indexFund = await deployIndexFund(
        registrar.proxy.address,
        apTeamMultisig.proxy.address,
        proxyAdminMultisig.address,
        deployer,
        hre
      );

      const endowmentMultiSig = await deployEndowmentMultiSig(
        registrar.proxy.address,
        proxyAdminMultisig.address,
        apTeamMultisig.proxy.address,
        deployer,
        hre
      );

      const vaultEmitter = await deployVaultEmitter(proxyAdminMultisig.address, deployer, hre);

      await hre.run("manage:registrar:updateConfig", {
        accountsContract: accounts.diamond.address, //Address
        indexFundContract: indexFund.proxy.address, //address
        treasury: treasuryAddress,
        uniswapRouter: thirdPartyAddresses.uniswap.swapRouter.address, //address
        uniswapFactory: thirdPartyAddresses.uniswap.factory.address, //address
        multisigFactory: endowmentMultiSig.factory.address, //address
        multisigEmitter: endowmentMultiSig.emitter.proxy.address, //address
        charityApplications: charityApplications.proxy.address, //address
        proxyAdmin: proxyAdminMultisig.address, //address
        usdcAddress: thirdPartyAddresses.usdcToken.address,
        wMaticAddress: thirdPartyAddresses.wmaticToken.address,
        gasFwdFactory: gasFwd.factory.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:registrar:setVaultEmitterAddress", {
        to: vaultEmitter.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:registrar:updateNetworkConnections", {
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

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
