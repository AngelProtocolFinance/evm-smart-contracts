import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { saveFrontendFiles } from "../../scripts/readWriteFile"
import { EndowmentMultiSig__factory, MultiSigWalletFactory__factory } from "../../typechain-types"
import * as logger from "../../utils/logger"

task(
    "upgrade:upgradeEndowmentMultisig",
    "Will upgrade the implementation of the EndowmentMultiSig contracts"
).setAction(async (_taskArguments, hre) => {
    try {
        const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

        console.log("Deploying a new EndowmentMultiSig contract...")

        const factory = new EndowmentMultiSig__factory(_deployer)
        const contract = await factory.deploy()
        await contract.deployed()

        console.log(`Upgrading EndowmentMultiSig implementation address inside MultiSigWalletFactory...`)

        const multisigWalletFactory = MultiSigWalletFactory__factory.connect(
            addresses.EndowmentMultiSigAddress.MultiSigWalletFactory,
            _deployer
        )
        const tx = await multisigWalletFactory.updateImplementation(contract.address)
        console.log(`Tx hash: ${tx.hash}`)

        const receipt = await hre.ethers.provider.waitForTransaction(tx.hash)
        if (!receipt.status) {
            throw new Error(`Failed to update EndowmentMultiSig implementation address inside MultiSigWalletFactory.`)
        }

        console.log("Saving new implementation address to JSON file...")

        const EndowmentMultiSigAddress = { ...addresses.EndowmentMultiSigAddress }
        EndowmentMultiSigAddress.MultiSigWalletImplementation = contract.address
        await saveFrontendFiles({ EndowmentMultiSigAddress })
    } catch (error) {
        logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error)
    } finally {
        console.log("Done.")
    }
})
