import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { FacetCutAction, getSelectors } from "../../contracts/core/accounts/scripts/libraries/diamond"
import {
    AccountsUpdateEndowmentSettingsController__factory,
    DiamondCutFacet__factory,
    DiamondLoupeFacet__factory,
} from "../../typechain-types"
import * as logger from "../../utils/logger"
import shouldVerify from "../../utils/shouldVerify"

task(
    "upgrade:upgradeAccountsUpdateEndowmentSettingsController",
    "Will upgrade the AccountsUpdateEndowmentSettingsController facet"
).setAction(async (_taskArguments, hre) => {
    try {
        console.log("Upgrading AccountsUpdateEndowmentSettingsController facet...")

        const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

        const factory = new AccountsUpdateEndowmentSettingsController__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
            },
            proxyAdmin
        )

        const contract = await factory.deploy()
        await contract.deployed()

        console.log("New AccountsUpdateEndowmentSettingsController implementation address:", contract.address)

        console.log("Updating Diamond with new AccountsUpdateEndowmentSettingsController address...")

        const curDiamondCut = {
            facetAddress: contract.address,
            action: FacetCutAction.Replace,
            functionSelectors: getSelectors(contract),
        }

        const diamondCut = DiamondCutFacet__factory.connect(addresses.accounts.diamond, proxyAdmin)

        const tx = await diamondCut.diamondCut([curDiamondCut], addresses.accounts.diamond, "0x")
        const receipt = await hre.ethers.provider.waitForTransaction(tx.hash)

        if (!receipt.status) {
            throw new Error(`Diamond upgrade failed: ${tx.hash}`)
        }

        // // Confirm that the diamond facet is using the new implementation
        const diamondLoupe = DiamondLoupeFacet__factory.connect(addresses.accounts.diamond, proxyAdmin)
        const sampleFunctionSelector = curDiamondCut.functionSelectors[0]
        const facetAddress = await diamondLoupe.facetAddress(sampleFunctionSelector)
        if (facetAddress !== contract.address) {
            throw new Error(`Diamond's facet's new address wronly set, new address: ${facetAddress}`)
        }

        if (shouldVerify(hre.network)) {
            console.log("Verifying the contract...")

            await hre.run("verify:verify", {
                address: facetAddress,
                constructorArguments: [],
            })
        }
    } catch (error) {
        logger.out(
            `AccountsUpdateEndowmentSettingsController facet upgrade failed, reason: ${error}`,
            logger.Level.Error
        )
    } finally {
        console.log("Done.")
    }
})
