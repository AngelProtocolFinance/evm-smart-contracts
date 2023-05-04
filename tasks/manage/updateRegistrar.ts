import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import config from "../../config"
import addresses from "../../contract-address.json"
import { Registrar } from "../../typechain-types"
import { RegistrarMessages } from "../../typechain-types/contracts/core/registrar/interface/IRegistrar"
import { multisigs } from "../../typechain-types/contracts"

task("manage:updateRegistrar", "Will update the registrar config")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            let [deployer, apTeam1] = await hre.ethers.getSigners()

            const registrar = (await hre.ethers.getContractAt(
                "Registrar",
                addresses.registrar.registrarProxy
            )) as Registrar

            console.log("Current config")
            let currentConfig = await registrar.queryConfig()
            console.log(currentConfig)

            let newConfig: RegistrarMessages.UpdateConfigRequestStruct = {
                accountsContract: addresses.accounts.diamond,
                taxRate: config.REGISTRAR_DATA.taxRate,
                rebalance: config.REGISTRAR_DATA.rebalance,
                approved_charities: [],
                splitMax: config.REGISTRAR_DATA.splitToLiquid.max,
                splitMin: config.REGISTRAR_DATA.splitToLiquid.min,
                splitDefault:
                    config.REGISTRAR_DATA.splitToLiquid.defaultSplit,
                collectorShare: 1,
                acceptedTokens: config.REGISTRAR_DATA.acceptedTokens,
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
                charityProposal: addresses.charityApplication.CharityApplicationProxy,
                lockedWithdrawal: addresses.lockedWithdraw.LockedWithdrawProxy,
                proxyAdmin: deployer.address,
                usdcAddress: addresses.Tokens.usdc,
                wethAddress: addresses.Tokens.weth,
                cw900lvAddress: apTeam1.address,
            }
            let tx = await registrar.updateConfig(newConfig)
            await hre.ethers.provider.waitForTransaction(tx.hash)

            let updatedConfig = await registrar.queryConfig()
            console.log(updatedConfig)
            
        } catch (error) {
            console.log(error)
        }
    })
