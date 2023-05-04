import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { APTeamMultiSig__factory, ApplicationsMultiSig__factory, TransparentUpgradeableProxy__factory } from "../../typechain-types"
import { saveFrontendFiles } from '../../scripts/readWriteFile'
import { HardhatRuntimeEnvironment } from "hardhat/types"

task("upgrade:upgradeMultisig", "Will upgrade the implementation of the AP Team and Applications multisigs")
    .setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            [deployer, apTeam1] = await hre.ethers.getSigners()
            console.log(apTeam1.address)

            let IMPLEMENTATION_ADDRESS_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
            let ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
            // Connect to the Proxy contracts 
            const APTeamProxy = TransparentUpgradeableProxy__factory
                .connect(
                    addresses.multiSig.APTeamMultiSigProxy, 
                    deployer
                )
            const ApplicationsProxy = TransparentUpgradeableProxy__factory
                .connect(
                    addresses.multiSig.ApplicationsMultiSigProxy, 
                    apTeam1
                )

            // Log the current state
            // let currentAPAdmin = await hre.ethers.provider.getStorageAt(
            //     ApplicationsProxy.address, 
            //     ADMIN_SLOT
            // )
            // console.log("Current Applications Admin: ", currentAPAdmin)

            let currentAPImpl = await hre.ethers.provider.getStorageAt(
                                    APTeamProxy.address, 
                                    IMPLEMENTATION_ADDRESS_SLOT
                                )
            console.log("Current AP Team Impl: ", currentAPImpl)
            console.log("For proxy at: ", APTeamProxy.address)
            
            let currentAppsImpl = await  hre.ethers.provider.getStorageAt(
                                    ApplicationsProxy.address,
                                    IMPLEMENTATION_ADDRESS_SLOT
                                )
            console.log("Current Apps impl: ", currentAppsImpl)
            console.log("For proxy at: ", ApplicationsProxy.address)

            // Deploy the new multisig implementations and try to verify them
            const APMultisig = await hre.ethers.getContractFactory("APTeamMultiSig") as APTeamMultiSig__factory
            const apMultisigImpl = await APMultisig.deploy()
            await apMultisigImpl.deployed()
            console.log("New AP Team Multisig Impl: ", apMultisigImpl.address)

            const AppsMultisig =  await hre.ethers.getContractFactory("ApplicationsMultiSig") as ApplicationsMultiSig__factory
            const appsMultisigImpl = await AppsMultisig.deploy()
            await appsMultisigImpl.deployed()
            console.log("New Applications Multisig Impl: ", appsMultisigImpl.address)

            // Send the upgrade call and wait for the tx to be finalized 
            let tx1 = await APTeamProxy.upgradeTo(apMultisigImpl.address)
            await hre.ethers.provider.waitForTransaction(tx1.hash) 
            let tx2 = await ApplicationsProxy.upgradeTo(appsMultisigImpl.address)
            await hre.ethers.provider.waitForTransaction(tx2.hash)

            // Confirm that the proxy is pointed to the new implementation
            let newAPImpl = await hre.ethers.provider.getStorageAt(
                                APTeamProxy.address, 
                                IMPLEMENTATION_ADDRESS_SLOT
                            )
            console.log("New AP Team Impl: ", newAPImpl)
            
            let newAppsImpl = await  hre.ethers.provider.getStorageAt(
                                ApplicationsProxy.address,
                                IMPLEMENTATION_ADDRESS_SLOT
                            )
            console.log("New Apps impl: ", newAppsImpl)

            // Save frontend files 
            let multiSig = {
                ApplicationsMultiSigProxy: ApplicationsProxy.address,
                APTeamMultiSigProxy: APTeamProxy.address,
                ApplicationMultisigImplementation: appsMultisigImpl.address,
                APTeamMultisigImplementation: apMultisigImpl.address
            }
            await saveFrontendFiles({multiSig})
            await verifyContract(hre, apMultisigImpl.address, "contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig")
            await verifyContract(hre, appsMultisigImpl.address, "contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig")

        } catch (error) {
            console.log(error)
        }
    }
)

async function verifyContract(hre: HardhatRuntimeEnvironment, addr: string, contractPath: string) {
    console.log("Verifying new implementation...")
    try{
        await hre.run("verify:verify", {
            address: addr,
            contract: contractPath,
            constructorArguments: []
        })
    }
    catch (error) {
        console.log("Error while verifying: ", contractPath)
        console.log(error)
    }
}