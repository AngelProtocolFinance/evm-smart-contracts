import config from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {task} from "hardhat/config";
import {
  confirmAction,
  connectSignerFromPkey,
  getAddresses,
  getSigners,
  isLocalNetwork,
  logger,
  verify,
} from "utils";
import {updateRegistrarNetworkConnections} from "../helpers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

type TaskArgs = {
  apTeamMultisig?: string;
  router?: string;
  apTeamSignerPkey?: string;
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
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
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

      const {treasury, deployer, apTeamMultisigOwners} = await getSigners(hre);

      let treasuryAddress = treasury ? treasury.address : config.PROD_CONFIG.Treasury;

      let apTeamSigner: SignerWithAddress;
      if (!apTeamMultisigOwners && taskArgs.apTeamSignerPkey) {
        apTeamSigner = await connectSignerFromPkey(taskArgs.apTeamSignerPkey, hre);
      } else if (!apTeamMultisigOwners) {
        throw new Error("Must provide a pkey for AP Team signer on this network");
      } else {
        apTeamSigner = apTeamMultisigOwners[0];
      }

      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const oldRouterAddress = taskArgs.router || addresses.router.proxy;

      const registrar = await deployRegistrar(
        {
          axelarGateway: addresses.axelar.gateway,
          axelarGasService: addresses.axelar.gasService,
          router: oldRouterAddress,
          owner: apTeamMultiSig,
          deployer,
          proxyAdmin: addresses.multiSig.proxyAdmin,
          treasury: treasuryAddress,
          apTeamMultisig: apTeamMultiSig,
        },
        hre
      );

      await hre.run("manage:registrar:updateConfig", {
        accountsContract: addresses.accounts.diamond,
        collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare,
        gasFwdFactory: addresses.gasFwd.factory,
        indexFundContract: addresses.indexFund.proxy,
        treasury: treasuryAddress,
        uniswapRouter: addresses.uniswap.swapRouter,
        uniswapFactory: addresses.uniswap.factory,
        multisigFactory: addresses.multiSig.endowment.factory,
        multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
        charityApplications: addresses.multiSig.charityApplications.proxy,
        proxyAdmin: addresses.multiSig.proxyAdmin,
        usdcAddress: addresses.tokens.usdc,
        wMaticAddress: addresses.tokens.wmatic,
        yes: true,
      });

      await hre.run("manage:registrar:setVaultEmitterAddress", {
        vaultEmitter: addresses.vaultEmitter.proxy,
        yes: true,
      });

      const router = await deployRouter(
        registrar.proxy.address,
        addresses.multiSig.proxyAdmin,
        deployer,
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      await updateRegistrarNetworkConnections(
        registrar.proxy.address,
        apTeamMultiSig,
        {router: router.proxy.address},
        apTeamSigner,
        hre
      );

      await hre.run("manage:accounts:updateConfig", {
        registrarContract: registrar.proxy.address,
        yes: true,
      });
      await hre.run("manage:IndexFund:updateConfig", {
        registrarContract: registrar.proxy.address,
        yes: true,
      });
      await hre.run("manage:GasFwdFactory:updateRegistrar", {
        newRegistrar: registrar.proxy.address,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, registrar.implementation);
        await verify(hre, registrar.proxy);
        if (router) {
          await verify(hre, router.implementation);
          await verify(hre, router.proxy);
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
