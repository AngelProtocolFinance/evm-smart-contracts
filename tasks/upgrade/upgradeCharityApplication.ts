import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { saveFrontendFiles } from "../../scripts/readWriteFile"
import { CharityApplication__factory, ITransparentUpgradeableProxy__factory } from "../../typechain-types"
import { logger, shouldVerify } from "../../utils"

task(
    "upgrade:upgradeCharityApplication",
    "Will upgrade the implementation of the Charity Application multisig"
).setAction(async (_taskArguments, hre) => {
    try {
        logger.out("Upgrading CharityApplication implementation...")

        const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

        const IMPLEMENTATION_ADDRESS_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

        logger.out("Upgrading CharityApplicationLib...")

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

        logger.out(`CharityApplication implementation address: ${charityApplicationImpl.address}`)

        const CharityApplicationProxy = ITransparentUpgradeableProxy__factory.connect(
            addresses.charityApplication.CharityApplicationProxy,
            proxyAdmin
        )

        // // Confirm that the proxy is pointed to the new implementation
        const currentCharityApplImpl = await hre.ethers.provider.getStorageAt(
            CharityApplicationProxy.address,
            IMPLEMENTATION_ADDRESS_SLOT
        )
        logger.out(`Current AP Team Impl: ${currentCharityApplImpl}`)
        logger.out(`For proxy at: ${CharityApplicationProxy.address}`)

        const tx = await CharityApplicationProxy.upgradeTo(charityApplicationImpl.address)
        await hre.ethers.provider.waitForTransaction(tx.hash)

        // // Confirm that the proxy is pointed to the new implementation
        const newCharityApplImpl = await hre.ethers.provider.getStorageAt(
            CharityApplicationProxy.address,
            IMPLEMENTATION_ADDRESS_SLOT
        )
        logger.out(`New Charity Application Impl: ${newCharityApplImpl}`)

        // // Save frontend files
        const charityApplication = {
            CharityApplicationProxy: CharityApplicationProxy.address,
            CharityApplicationImplementation: charityApplicationImpl.address,
        }
        await saveFrontendFiles({ charityApplication })

        if (shouldVerify(hre.network)) {
            logger.out("Verifying the contract...")

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
    } catch (error) {
        logger.out(error, logger.Level.Error)
    } finally {
        logger.out("Done.")
    }
})
