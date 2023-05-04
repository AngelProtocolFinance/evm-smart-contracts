import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { AccountsCreateEndowment, AccountsQueryEndowments, MultiSigGeneric, Registrar } from "../../typechain-types"
import { AccountMessages } from "../../typechain-types/contracts/core/accounts/IAccounts"
import { genWallet } from "../../util/keygen"

task("manage:depositERC20", "Will attempt to deposit tokens").setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            [deployer, apTeam1] =
                await hre.ethers.getSigners()



            let createEndowmentFacet = await hre.ethers.getContractAt(
                                        "AccountsCreateEndowment",
                                        addresses.accounts.diamond) as AccountsCreateEndowment
            let queryEndowmentFacet = await hre.ethers.getContractAt(
                                        "AccountsQueryEndowments",
                                        addresses.accounts.diamond) as AccountsQueryEndowments
            let registrar = await hre.ethers.getContractAt(
                                        "Registrar",
                                        addresses.registrar.registrarProxy) as Registrar

            let registrarConfig = await registrar.queryConfig()
            console.log(registrarConfig)
            
        } catch (error) {
            console.log(error)
        }
    }
)
