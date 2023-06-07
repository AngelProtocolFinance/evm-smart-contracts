import config from "config";
import {task} from "hardhat/config";
import type {TaskArguments} from "hardhat/types";
import {Registrar} from "typechain-types";
import {ADDRESS_ZERO, getAddresses, getSigners, logger} from "utils";

import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";

task("manage:updateRegistrar", "Will update the registrar config").setAction(
  async (taskArguments: TaskArguments, hre) => {
    try {
      const {proxyAdmin, apTeam1, treasury} = await getSigners(hre.ethers);

      const addresses = await getAddresses(hre);

      const registrar = (await hre.ethers.getContractAt(
        "Registrar",
        addresses.registrar.proxy
      )) as Registrar;

      logger.out("Current config");
      let currentConfig = await registrar.queryConfig();
      logger.out(currentConfig);

      let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
        accountsContract: addresses.accounts.diamond,
        approved_charities: [],
        splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
        splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
        splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
        collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare,
        subdaoGovContract: addresses.subDao.implementation, // subdao gov
        subdaoTokenContract: addresses.subDao.token, // subdao gov token (basic CW20)
        subdaoBondingTokenContract: addresses.subDao.veBondingToken, // subdao gov token (w/ bonding-curve)
        subdaoCw900Contract: addresses.incentivisedVotingLockup.implementation, // subdao gov ve-CURVE contract for locked token voting
        subdaoDistributorContract: apTeam1.address, // subdao gov fee distributor
        subdaoEmitter: addresses.subDao.emitter.proxy,
        donationMatchContract: addresses.donationMatch.implementation, // donation matching contract

        // CONTRACT ADSRESSES
        indexFundContract: addresses.indexFund.proxy,
        govContract: apTeam1.address,
        treasury: treasury.address,
        donationMatchCharitesContract: addresses.donationMatchCharity.proxy,
        donationMatchEmitter: ADDRESS_ZERO,
        haloToken: apTeam1.address,
        haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract,
        charitySharesContract: apTeam1.address,
        fundraisingContract: apTeam1.address,
        applicationsReview: addresses.multiSig.applications.proxy,
        swapsRouter: addresses.swapRouter.proxy,
        multisigFactory: addresses.multiSig.endowment.factory,
        multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
        charityProposal: ADDRESS_ZERO,
        proxyAdmin: proxyAdmin.address,
        usdcAddress: config.REGISTRAR_UPDATE_CONFIG.usdcAddress,
        wMaticAddress: config.REGISTRAR_UPDATE_CONFIG.wmaticAddress,
        cw900lvAddress: apTeam1.address,
        lockedWithdrawal: ADDRESS_ZERO,
      };
      let tx = await registrar.updateConfig(newConfig);
      await hre.ethers.provider.waitForTransaction(tx.hash);

      let updatedConfig = await registrar.queryConfig();
      logger.out(updatedConfig);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  }
);
