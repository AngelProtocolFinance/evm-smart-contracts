import addresses from "contract-address.json"
import { task } from "hardhat/config"
import { saveFrontendFiles } from "utils"
import { EndowmentMultiSig__factory, MultiSigWalletFactory__factory } from "typechain-types"
import { logger, shouldVerify } from "utils"

task(
    "upgrade:upgradeEndowmentMultiSig",
    "Will upgrade the implementation of the EndowmentMultiSig contracts"
).setAction(async (_taskArguments, hre) => {
    try {
        const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

        logger.out("Deploying a new EndowmentMultiSig contract...")

        const factory = new EndowmentMultiSig__factory(proxyAdmin)
        const contract = await factory.deploy()
        await contract.deployed()

        logger.out(`Deployed at: ${contract.address}`)

        logger.out(`Upgrading EndowmentMultiSig implementation address inside MultiSigWalletFactory...`)

        const multisigWalletFactory = MultiSigWalletFactory__factory.connect(
            addresses.EndowmentMultiSigAddress.MultiSigWalletFactory,
            proxyAdmin
        )
        const tx = await multisigWalletFactory.updateImplementation(contract.address)
        logger.out(`Tx hash: ${tx.hash}`)

        const receipt = await hre.ethers.provider.waitForTransaction(tx.hash)
        if (!receipt.status) {
            throw new Error(`Failed to update EndowmentMultiSig implementation address inside MultiSigWalletFactory.`)
        }

        logger.out("Saving the new implementation address to JSON file...")

        const EndowmentMultiSigAddress = { ...addresses.EndowmentMultiSigAddress }
        EndowmentMultiSigAddress.MultiSigWalletImplementation = contract.address
        await saveFrontendFiles({ EndowmentMultiSigAddress })

        if (shouldVerify(hre.network)) {
            logger.out("Verifying the contract...")

            await hre.run("verify:verify", {
                address: contract.address,
                constructorArguments: [],
            })
        }
    } catch (error) {
        logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error)
    } finally {
        logger.out("Done.")
    }
})
