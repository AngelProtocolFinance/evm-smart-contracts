import config from "config";
import {task} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {ADDRESS_ZERO, getAddresses, getSigners, logger} from "utils";

task(
  "manage:updateRegistrar",
  "Will update the registrar config with the most recent addresses & config data"
).setAction(async (_, hre) => {
  try {
    const {deployer, proxyAdmin, apTeam1, treasury, apTeamMultisigOwners} = await getSigners(hre);

    const addresses = await getAddresses(hre);

    const registrar = Registrar__factory.connect(addresses.registrar.proxy, deployer);

    logger.out("Current config");
    let currentConfig = await registrar.queryConfig();
    logger.out(JSON.stringify(currentConfig, undefined, 2));

    logger.out("Setting up data...");
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
      uniswapSwapRouter: addresses.uniswapSwapRouter,
      multisigFactory: addresses.multiSig.endowment.factory,
      multisigEmitter: addresses.multiSig.endowment.emitter.proxy,
      charityProposal: addresses.charityApplication.proxy,
      proxyAdmin: proxyAdmin.address,
      usdcAddress: addresses.tokens.usdc,
      wMaticAddress: config.REGISTRAR_UPDATE_CONFIG.wmaticAddress,
      cw900lvAddress: apTeam1.address,
      lockedWithdrawal: ADDRESS_ZERO,
    };
    const updateConfigData = registrar.interface.encodeFunctionData("updateConfig", [newConfig]);

    const apTeamMultiSig = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamMultisigOwners[0]
    );
    logger.out("Submitting 'updateConfig' transaction...");
    const tx = await apTeamMultiSig.submitTransaction(
      "Update Registrar config",
      "Update Registrar config from a 'manage:updateRegistrar' task",
      addresses.registrar.proxy,
      0,
      updateConfigData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();

    let updatedConfig = await registrar.queryConfig();
    logger.out("New config:");
    logger.out(JSON.stringify(updatedConfig, undefined, 2));
  } catch (error) {
    logger.out(error, logger.Level.Error);
  } finally {
    logger.out("Done");
  }
});
