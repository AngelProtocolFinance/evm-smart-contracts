import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import { getAddresses, updateAddresses } from "utils"
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

            const addresses = await getAddresses(hre)

            let IMPLEMENTATION_ADDRESS_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

            // Get the new Multisig Factories
            const APMultisig = new APTeamMultiSig__factory(proxyAdmin)
            const apMultisigImpl = await APMultisig.deploy()
            await apMultisigImpl.deployed()

            const AppsMultisig = new ApplicationsMultiSig__factory(proxyAdmin)
            const appsMultisigImpl = await AppsMultisig.deploy()
            await appsMultisigImpl.deployed()

            // Connect to the Proxy contracts
            const APTeamProxy = ITransparentUpgradeableProxy__factory.connect(
                addresses.multiSig.APTeamMultiSigProxy,
                proxyAdmin
            )
            const ApplicationsProxy = ITransparentUpgradeableProxy__factory.connect(
                addresses.multiSig.applications.proxy,
                proxyAdmin
            )

            // Confirm that the proxy is pointed to the new implementation
            let currentAPImpl = await hre.ethers.provider.getStorageAt(APTeamProxy.address, IMPLEMENTATION_ADDRESS_SLOT)
            logger.out(`Current AP Team Impl: ${currentAPImpl}`)
            logger.out(`For proxy at: ${APTeamProxy.address}`)

            let currentAppsImpl = await hre.ethers.provider.getStorageAt(
                ApplicationsProxy.address,
                IMPLEMENTATION_ADDRESS_SLOT
            )
            logger.out(`Current Apps impl: ${currentAppsImpl}`)
            logger.out(`For proxy at: ${ApplicationsProxy.address}`)
            
            // Send the upgrade call and wait for the tx to be finalized 
            logger.out("Upgrading APTeamMultiSig proxy implementation...")
            let tx1 = await APTeamProxy.upgradeTo(apMultisigImpl.address)
            logger.out(`Tx hash: ${tx1.hash}`)
            await hre.ethers.provider.waitForTransaction(tx1.hash) 

            logger.out("Upgrading ApplicationsMultiSig proxy implementation...")
            let tx2 = await ApplicationsProxy.upgradeTo(appsMultisigImpl.address)
            await hre.ethers.provider.waitForTransaction(tx2.hash)
            logger.out(`Tx hash: ${tx1.hash}`)

            // Confirm that the proxy is pointed to the new implementation
            let newAPImpl = await hre.ethers.provider.getStorageAt(APTeamProxy.address, IMPLEMENTATION_ADDRESS_SLOT)
            logger.out(`New AP Team Impl: ${newAPImpl}`)

            let newAppsImpl = await hre.ethers.provider.getStorageAt(
                ApplicationsProxy.address,
                IMPLEMENTATION_ADDRESS_SLOT
            )
            logger.out(`New Apps impl: ${newAppsImpl}`)

            logger.out("Saving the new implementation address to JSON file...")
            await updateAddresses(
                { 
                    multiSig: {
                        ...addresses.multiSig,
                        applications: {
                            ...addresses.multiSig.applications,
                            implementation: appsMultisigImpl.address
                        },
                        APTeamMultisigImplementation: apMultisigImpl.address,
                    }
                },
                hre
            )

            if (shouldVerify(hre.network)) {
                logger.out("Verifying APTeamMultiSig...")
    
                await hre.run("verify:verify", {
                    address: apMultisigImpl.address,
                    constructorArguments: [],
                    contract: "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig"
                })

                logger.out("\nVerifying ApplicationsMultiSig...")

                await hre.run("verify:verify", {
                    address: appsMultisigImpl.address,
                    constructorArguments: [],
                    contract: "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig"
                })
            }
        } catch (error) {
            logger.out(error, logger.Level.Error)
        } finally {
            logger.out("Done.")
        }
    }
)
