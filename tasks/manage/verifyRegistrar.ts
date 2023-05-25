import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import { Registrar } from "typechain-types"
import { getAddresses, logger } from "utils"

task("manage:verifyRegistrar", "Will create a new charity endowment").setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            let apTeam2: SignerWithAddress
            let apTeam3: SignerWithAddress
            [deployer, apTeam1, apTeam2, apTeam3] =
                await hre.ethers.getSigners()

            const addresses = await getAddresses(hre)

            let registrar = await hre.ethers.getContractAt(
                                        "Registrar",
                                        addresses.registrar.proxy) as Registrar

            let registrarConfig = await registrar.queryConfig()
            logger.out(`Registrar owner: ${registrarConfig.owner}`)
            
            await hre.run("verify:verify", {
                address: addresses.registrar.implementation,
                constructorArguments: [],
            })
            
        } catch (error) {
            logger.out(error, logger.Level.Error)
        }
    }
)
