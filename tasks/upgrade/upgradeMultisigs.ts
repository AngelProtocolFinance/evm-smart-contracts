import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import addresses from "contract-address.json"
import { task } from "hardhat/config"
import { saveFrontendFiles } from "scripts/readWriteFile"
import {
    APTeamMultiSig__factory,
    ApplicationsMultiSig__factory,
    ITransparentUpgradeableProxy__factory,
} from "typechain-types"
import { logger, shouldVerify } from "utils"

task("upgrade:upgradeMultisig", "Will upgrade the implementation of the AP Team and Applications multisigs").setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let proxyAdmin: SignerWithAddress
            ;[deployer, proxyAdmin] = await hre.ethers.getSigners()

            let IMPLEMENTATION_ADDRESS_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

            // Get the new Multisig Factories
            const APMultisig = new APTeamMultiSig__factory()
            const apMultisigImpl = await APMultisig.deploy()
            await apMultisigImpl.deployed()

            const AppsMultisig = new ApplicationsMultiSig__factory()
            const appsMultisigImpl = await AppsMultisig.deploy()
            await appsMultisigImpl.deployed()

            // Connect to the Proxy contracts
            const APTeamProxy = ITransparentUpgradeableProxy__factory.connect(
                addresses.multiSig.APTeamMultiSigProxy,
                proxyAdmin
            )
            const ApplicationsProxy = ITransparentUpgradeableProxy__factory.connect(
                addresses.multiSig.ApplicationsMultiSigProxy,
                proxyAdmin
            )

            // Confirm that the proxy is pointed to the new implementation
            let currentAPImpl = await hre.ethers.provider.getStorageAt(APTeamProxy.address, IMPLEMENTATION_ADDRESS_SLOT)
            console.log("Current AP Team Impl: ", currentAPImpl)
            console.log("For proxy at: ", APTeamProxy.address)

            let currentAppsImpl = await hre.ethers.provider.getStorageAt(
                ApplicationsProxy.address,
                IMPLEMENTATION_ADDRESS_SLOT
            )
            console.log("Current Apps impl: ", currentAppsImpl)
            console.log("For proxy at: ", ApplicationsProxy.address)

            // Send the upgrade call and wait for the tx to be finalized
            let tx1 = await APTeamProxy.upgradeTo(apMultisigImpl.address)
            await hre.ethers.provider.waitForTransaction(tx1.hash)
            let tx2 = await ApplicationsProxy.upgradeTo(appsMultisigImpl.address)
            await hre.ethers.provider.waitForTransaction(tx2.hash)

            // Confirm that the proxy is pointed to the new implementation
            let newAPImpl = await hre.ethers.provider.getStorageAt(APTeamProxy.address, IMPLEMENTATION_ADDRESS_SLOT)
            console.log("New AP Team Impl: ", newAPImpl)

            let newAppsImpl = await hre.ethers.provider.getStorageAt(
                ApplicationsProxy.address,
                IMPLEMENTATION_ADDRESS_SLOT
            )
            console.log("New Apps impl: ", newAppsImpl)

            // Save frontend files
            let multiSig = {
                ApplicationsMultiSigProxy: ApplicationsProxy.address,
                APTeamMultiSigProxy: APTeamProxy.address,
                ApplicationMultisigImplementation: appsMultisigImpl.address,
                APTeamMultisigImplementation: apMultisigImpl.address,
            }
            await saveFrontendFiles({ multiSig })

            if (shouldVerify(hre.network)) {
                logger.out("Verifying the contract...")

                await hre.run("verify:verify", {
                    address: appsMultisigImpl.address,
                    constructorArguments: [],
                })
                await hre.run("verify:verify", {
                    address: apMultisigImpl.address,
                    constructorArguments: [],
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            logger.out("Done.")
        }
    }
)
