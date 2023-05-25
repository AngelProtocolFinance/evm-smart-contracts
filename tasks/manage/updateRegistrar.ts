import config from "config"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { Registrar } from "typechain-types"
import { RegistrarMessages } from "typechain-types/contracts/core/registrar/interfaces/IRegistrar"
import { ADDRESS_ZERO, getAddresses, logger } from "utils"

task("manage:updateRegistrar", "Will update the registrar config")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            let [deployer, apTeam1] = await hre.ethers.getSigners()

            const addresses = await getAddresses(hre)

            const registrar = (await hre.ethers.getContractAt(
                "Registrar",
                addresses.registrar.proxy
            )) as Registrar

            logger.out("Current config")
            let currentConfig = await registrar.queryConfig()
            logger.out(currentConfig)

            let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
                accountsContract: addresses.accounts.diamond,
                approved_charities: [],
                splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
                splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
                splitDefault:
                    config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
                collectorShare: 1,
                subdaoGovContract: apTeam1.address, // subdao gov
                subdaoTokenContract: apTeam1.address, // subdao gov token (basic CW20)
                subdaoBondingTokenContract: apTeam1.address, // subdao gov token (w/ bonding-curve)
                subdaoCw900Contract: apTeam1.address, // subdao gov ve-CURVE contract for locked token voting
                subdaoDistributorContract: apTeam1.address, // subdao gov fee distributor
                subdaoEmitter: apTeam1.address,
                donationMatchContract: apTeam1.address, // donation matching contract

                // CONTRACT ADSRESSES
                indexFundContract: addresses.indexFund.proxy,
                govContract: apTeam1.address,
                treasury: apTeam1.address,
                donationMatchCharitesContract: addresses.donationMatchCharity.proxy,
                donationMatchEmitter: apTeam1.address,
                haloToken: apTeam1.address,
                haloTokenLpContract: apTeam1.address,
                charitySharesContract: apTeam1.address,
                fundraisingContract: apTeam1.address,
                applicationsReview: apTeam1.address,
                swapsRouter: apTeam1.address,
                multisigFactory:
                    addresses.multiSig.endowment.factory,
                multisigEmitter:
                    addresses.multiSig.endowment
                        .emitter.proxy,
                charityProposal: addresses.charityApplication.proxy,
                proxyAdmin: deployer.address,
                usdcAddress: addresses.tokens.usdc,
                wethAddress: addresses.tokens.weth,
                cw900lvAddress: apTeam1.address,
                lockedWithdrawal: ADDRESS_ZERO,
        }
            let tx = await registrar.updateConfig(newConfig)
            await hre.ethers.provider.waitForTransaction(tx.hash)

            let updatedConfig = await registrar.queryConfig()
            logger.out(updatedConfig)
            
        } catch (error) {
            logger.out(error, logger.Level.Error)
        }
    })
