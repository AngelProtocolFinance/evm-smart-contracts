import {CONFIG} from "config";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {task} from "hardhat/config";
import {confirmAction, getAddresses, getSigners, isLocalNetwork, logger, verify} from "utils";

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

      const {treasury, deployer} = await getSigners(hre);

      let treasuryAddress = treasury ? treasury.address : CONFIG.PROD_CONFIG.Treasury;

      const addresses = await getAddresses(hre);

      const apTeamMultiSig = taskArgs.apTeamMultisig || addresses.multiSig.apTeam.proxy;
      const oldRouterAddress = taskArgs.router || addresses.router.proxy;

      const registrar = await deployRegistrar(
        {
          axelarGateway: addresses.axelar.gateway,
          axelarGasService: addresses.axelar.gasService,
          router: oldRouterAddress, // Router must be redeployed, so this will be updated
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
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      await hre.run("manage:registrar:setVaultEmitterAddress", {
        to: addresses.vaultEmitter.proxy,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      // Updates newly deployed Registrar's Router address
      await hre.run("deploy:Router", {
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        skipVerify: taskArgs.skipVerify,
        yes: true,
      });

      // update all contracts' registrar addresses
      await hre.run("manage:accounts:updateConfig", {
        registrarContract: registrar.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:IndexFund:updateConfig", {
        registrarContract: registrar.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });
      await hre.run("manage:GasFwdFactory:updateRegistrar", {
        newRegistrar: registrar.proxy.address,
        apTeamSignerPkey: taskArgs.apTeamSignerPkey,
        yes: true,
      });

      if (!isLocalNetwork(hre) && !taskArgs.skipVerify) {
        await verify(hre, registrar.implementation);
        await verify(hre, registrar.proxy);
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
