import {task} from "hardhat/config";
import config from "config";
import {cliTypes} from "tasks/types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {ADDRESS_ZERO, connectSignerFromPkey, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {
  acceptedTokens: string[];
  acceptanceStates: boolean[];
  apTeamSignerPkey?: string;
};

task(
  "manage:updateRegistrar",
  "Will update the registrar config with the most recent addresses & config data"
)
  .addOptionalParam("acceptedTokens", "List of accepted tokens.", [], cliTypes.array.string)
  .addOptionalParam(
    "acceptanceStates",
    "List of acceptance state flags related to `acceptedTokens`. Flag `acceptanceStates[i]` designates `acceptedTokens[i]` token's acceptance status (`true === accepted`, `false === not accepted`). Defaults to `true` for any index `i` that is not set in `acceptanceStates` but is set in `acceptedTokens`.",
    [],
    cliTypes.array.boolean
  )
  .addOptionalParam(
    "apTeamSignerPkey", 
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {treasury} = await getSigners(hre);
      let treasuryAddress = treasury? treasury.address : config.PROD_CONFIG.Treasury;

      const addresses = await getAddresses(hre);

      let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
        accountsContract: addresses.accounts.diamond,
        apTeamMultisig: addresses.multiSig.apTeam.proxy,
        treasury: treasuryAddress,
        indexFundContract: addresses.indexFund.proxy,
        haloToken: ADDRESS_ZERO,
        govContract: ADDRESS_ZERO,
        fundraisingContract: ADDRESS_ZERO,
        uniswapRouter: addresses.uniswap.swapRouter,
        uniswapFactory: addresses.uniswap.factory,
        multisigFactory: addresses.multiSig.endowment.factory,
        multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
        charityApplications: addresses.multiSig.charityApplications.proxy,
        proxyAdmin: addresses.multiSig.proxyAdmin,
        usdcAddress: addresses.tokens.usdc,
        wMaticAddress: addresses.tokens.wmatic,
        gasFwdFactory: addresses.gasFwd.factory,
      };

      if(taskArgs.apTeamSignerPkey) {
        await hre.run("manage:registrar:updateConfig", {
          ...newConfig,
          apTeamSignerPkey: taskArgs.apTeamSignerPkey,
          yes: true,
        });
        await hre.run("manage:registrar:setVaultEmitterAddress", {
          vaultEmitter: addresses.vaultEmitter.proxy,
          apTeamSignerPkey: taskArgs.apTeamSignerPkey,
          yes: true,
        });
      } else {
        await hre.run("manage:registrar:updateConfig", {
          ...newConfig,
          yes: true,
        });
        await hre.run("manage:registrar:setVaultEmitterAddress", {
          vaultEmitter: addresses.vaultEmitter.proxy,
          yes: true,
        });
      }

      if (taskArgs.acceptedTokens.length > 0) {
        logger.divider();
        logger.out("Updating accepted tokens...");
        for (let i = 0; i < taskArgs.acceptedTokens.length; i++) {
          try {
            const tokenAddress = taskArgs.acceptedTokens[i];
            const acceptanceState = taskArgs.acceptanceStates.at(i) ?? true;
            const signerKey = taskArgs.apTeamSignerPkey
            if(taskArgs.apTeamSignerPkey){
              await hre.run("manage:registrar:setTokenAccepted", {tokenAddress, acceptanceState, signerKey});
            } else {
              await hre.run("manage:registrar:setTokenAccepted", {tokenAddress, acceptanceState});
            }
          } catch (error) {
            logger.out(error, logger.Level.Error);
          }
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done");
    }
  });
