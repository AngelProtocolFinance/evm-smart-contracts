import config from "config";
import {task} from "hardhat/config";
import {updateRegistrarConfig} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {ADDRESS_ZERO, getAddresses, getSigners, logger} from "utils";

type TaskArgs = {
  acceptedTokens: string[];
  acceptanceStates: boolean[];
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
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {proxyAdmin, apTeam1, treasury} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
        accountsContract: addresses.accounts.diamond,
        splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
        splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
        splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
        collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare,
        // CONTRACT ADDRESSES
        subdaoGovContract: addresses.subDao.implementation, // subdao gov
        subdaoTokenContract: addresses.subDao.token, // subdao gov token (basic CW20)
        subdaoBondingTokenContract: addresses.subDao.veBondingToken, // subdao gov token (w/ bonding-curve)
        subdaoCw900Contract: addresses.incentivisedVotingLockup.implementation, // subdao gov ve-CURVE contract for locked token voting
        subdaoDistributorContract: apTeam1.address, // subdao gov fee distributor
        subdaoEmitter: addresses.subDao.emitter.proxy,
        donationMatchContract: addresses.donationMatch.implementation, // donation matching contract
        indexFundContract: addresses.indexFund.proxy,
        govContract: ADDRESS_ZERO,
        treasury: treasury.address,
        donationMatchCharitesContract: addresses.donationMatchCharity.proxy,
        donationMatchEmitter: ADDRESS_ZERO,
        haloToken: ADDRESS_ZERO,
        haloTokenLpContract: ADDRESS_ZERO,
        // haloTokenLpContract: addresses.halo.tokenLp, -> TODO: when implemented
        charitySharesContract: ADDRESS_ZERO,
        fundraisingContract: ADDRESS_ZERO,
        uniswapRouter: addresses.uniswap.swapRouter,
        uniswapFactory: addresses.uniswap.factory,
        multisigFactory: addresses.multiSig.endowment.factory,
        multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
        charityApplications: addresses.multiSig.charityApplications.proxy,
        proxyAdmin: proxyAdmin.address,
        usdcAddress: addresses.tokens.usdc,
        wMaticAddress: addresses.tokens.wmatic,
        cw900lvAddress: ADDRESS_ZERO,
        lockedWithdrawal: ADDRESS_ZERO,
        gasFwdFactory: addresses.gasFwd.factory
      };
      await updateRegistrarConfig(
        addresses.registrar.proxy,
        addresses.multiSig.apTeam.proxy,
        newConfig,
        hre
      );

      if (taskArgs.acceptedTokens.length > 0) {
        logger.divider();
        logger.out("Updating accepted tokens...");
        for (let i = 0; i < taskArgs.acceptedTokens.length; i++) {
          try {
            const tokenAddress = taskArgs.acceptedTokens[i];
            const acceptanceState = taskArgs.acceptanceStates.at(i) ?? true;
            await hre.run("manage:registrar:setTokenAccepted", {tokenAddress, acceptanceState});
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
