import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import addresses from "contract-address.json"
import { Registrar } from "typechain-types"
import { AccountMessages } from "typechain-types/contracts/core/accounts/IAccounts"

task("manage:verifyRegistrar", "Will create a new charity endowment").setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            let apTeam2: SignerWithAddress
            let apTeam3: SignerWithAddress
            [deployer, apTeam1, apTeam2, apTeam3] =
                await hre.ethers.getSigners()

            let registrar = await hre.ethers.getContractAt(
                                        "Registrar",
                                        addresses.registrar.registrarProxy) as Registrar

            let registrarConfig = await registrar.queryConfig()
            console.log("Registrar owner:", registrarConfig.owner)
            
            await hre.run("verify:verify", {
                address: addresses.registrar.registrarImplementation,
                constructorArguments: [],
            })
            
        } catch (error) {
            console.log(error)
        }
    }
)
