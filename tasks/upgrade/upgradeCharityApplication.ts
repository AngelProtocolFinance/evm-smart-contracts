import { task, types } from "hardhat/config"
import addresses from "../../contract-address.json"
import { saveFrontendFiles } from "../../scripts/readWriteFile"
import { CharityApplication__factory, ITransparentUpgradeableProxy__factory } from "../../typechain-types"
import * as logger from "../../utils/logger"

type TaskArguments = { verify_contracts: boolean }

task("upgrade:upgradeCharityApplication", "Will upgrade the implementation of the Charity Application multisig")
    .addOptionalParam("verify_contracts", "Flag specifying whether to verify the contract", false, types.boolean)
    .setAction(async ({ verify_contracts }: TaskArguments, hre) => {
        try {
            const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

            const IMPLEMENTATION_ADDRESS_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

            const CharityApplicationLib = await hre.ethers.getContractFactory("CharityApplicationLib", proxyAdmin)
            const CharityApplicationLibInstance = await CharityApplicationLib.deploy()
            await CharityApplicationLibInstance.deployed()

            const CharityApplication = new CharityApplication__factory(
                {
                    "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
                        CharityApplicationLibInstance.address,
                },
                proxyAdmin
            )

            const charityApplicationImpl = await CharityApplication.deploy()
            await charityApplicationImpl.deployed()

            console.log("CharityApplication implementation address:", charityApplicationImpl.address)

            const CharityApplicationProxy = ITransparentUpgradeableProxy__factory.connect(
                addresses.charityApplication.CharityApplicationProxy,
                proxyAdmin
            )

            // // Confirm that the proxy is pointed to the new implementation
            const currentCharityApplImpl = await hre.ethers.provider.getStorageAt(
                CharityApplicationProxy.address,
                IMPLEMENTATION_ADDRESS_SLOT
            )
            console.log("Current AP Team Impl: ", currentCharityApplImpl)
            console.log("For proxy at: ", CharityApplicationProxy.address)

            const tx = await CharityApplicationProxy.upgradeTo(charityApplicationImpl.address)
            await hre.ethers.provider.waitForTransaction(tx.hash)

            // // Confirm that the proxy is pointed to the new implementation
            const newCharityApplImpl = await hre.ethers.provider.getStorageAt(CharityApplicationProxy.address, IMPLEMENTATION_ADDRESS_SLOT)
            console.log("New Charity Application Impl: ", newCharityApplImpl)

            // // Save frontend files
            const charityApplication = {
                CharityApplicationProxy: CharityApplicationProxy.address,
                CharityApplicationImplementation: charityApplicationImpl.address,
            }
            await saveFrontendFiles({ charityApplication })

            if (verify_contracts) {
                console.log("Verifying the contract...")

                await hre.run("verify:verify", {
                    address: CharityApplicationLibInstance.address,
                    constructorArguments: [],
                })
                await hre.run("verify:verify", {
                    address: charityApplicationImpl.address,
                    constructorArguments: [],
                })
                await hre.run("verify:verify", {
                    address: CharityApplicationProxy.address,
                    constructorArguments: [charityApplicationImpl.address, proxyAdmin.address, "0x"],
                })
            }

            console.log("Done.")
        } catch (error) {
            logger.out(error, logger.Level.Error)
        }
    })
