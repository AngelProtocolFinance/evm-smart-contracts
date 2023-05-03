import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { envConfig } from "../../utils/env.config"

import addresses from "../../contract-address.json"
import { Registrar } from "../../typechain-types"
import { RegistrarMessages } from "../../typechain-types/contracts/core/registrar/interface/IRegistrar"

task("manage:updateRegistrar", "Will update the registrar config")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            let [_deployer, proxyAdmin, apTeam1] = await hre.ethers.getSigners()

            const registrar = (await hre.ethers.getContractAt(
                "Registrar",
                addresses.registrar.registrarProxy
            )) as Registrar

            console.log("Current config")
            let currentConfig = await registrar.queryConfig()
            console.log(currentConfig)

            let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
                accountsContract: addresses.accounts.diamond,
                taxRate: envConfig.REGISTRAR_DATA.taxRate,
                rebalance: envConfig.REGISTRAR_DATA.rebalance,
                approved_charities: [],
                splitMax: envConfig.REGISTRAR_DATA.splitToLiquid.max,
                splitMin: envConfig.REGISTRAR_DATA.splitToLiquid.min,
                splitDefault:
                    envConfig.REGISTRAR_DATA.splitToLiquid.defaultSplit,
                collectorShare: 1,
                acceptedTokens: envConfig.REGISTRAR_DATA.acceptedTokens,
                subdaoGovCode: apTeam1.address, // subdao gov wasm code
                subdaoCw20TokenCode: apTeam1.address, // subdao gov token (basic CW20) wasm code
                subdaoBondingTokenCode: apTeam1.address, // subdao gov token (w/ bonding-curve) wasm code
                subdaoCw900Code: apTeam1.address, // subdao gov ve-CURVE contract for locked token voting
                subdaoDistributorCode: apTeam1.address, // subdao gov fee distributor wasm code
                subdaoEmitter: apTeam1.address,
                donationMatchCode: apTeam1.address, // donation matching contract wasm code

                // CONTRACT ADSRESSES
                indexFundContract: addresses.indexFundAddress.indexFundProxy,
                govContract: apTeam1.address,
                treasury: apTeam1.address,
                donationMatchCharitesContract: addresses.HaloImplementations.DonationMatchAddress.DonationMatchProxy,
                donationMatchEmitter: apTeam1.address,
                haloToken: apTeam1.address,
                haloTokenLpContract: apTeam1.address,
                charitySharesContract: apTeam1.address,
                fundraisingContract: apTeam1.address,
                applicationsReview: apTeam1.address,
                swapsRouter: apTeam1.address,
                multisigFactory:
                    addresses.EndowmentMultiSigAddress.MultiSigWalletFactory,
                multisigEmitter:
                    addresses.EndowmentMultiSigAddress
                        .EndowmentMultiSigEmitterProxy,
                charityProposal: apTeam1.address,
                lockedWithdrawal: addresses.lockedWithdraw.LockedWithdrawProxy,
                proxyAdmin: proxyAdmin.address,
                usdcAddress: addresses.Tokens.usdc,
                wethAddress: addresses.Tokens.weth,
                cw900lvAddress: apTeam1.address,
            }
            await registrar.updateConfig(newConfig)
        } catch (error) {
            console.log(error)
        }
    })
