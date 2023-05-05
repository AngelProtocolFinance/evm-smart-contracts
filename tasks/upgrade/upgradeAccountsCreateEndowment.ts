import { task } from "hardhat/config"
import addresses from "../../contract-address.json"
import { FacetCutAction, getSelectors } from "../../contracts/core/accounts/scripts/libraries/diamond"
import { AccountsCreateEndowment__factory, DiamondCutFacet__factory, DiamondLoupeFacet__factory } from "../../typechain-types"

task("upgrade:upgradeAccountsCreateEndowment", "Will upgrade the AccountsCreateEndowment facet").setAction(async (_taskArguments, hre) => {
    try {
        console.log("Upgrading AccountsCreateEndowment facet.")

        const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

        const AccountsCreateEndowment = new AccountsCreateEndowment__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
            },
            proxyAdmin
        )

        const accountsCreateEndowmentImpl = await AccountsCreateEndowment.deploy()
        await accountsCreateEndowmentImpl.deployed()

        console.log("New AccountsCreateEndowment implementation address:", accountsCreateEndowmentImpl.address)

        console.log("Updating Diamond with new AccountsCreateEndowment address.")

        const curDiamondCut = {
            facetAddress: accountsCreateEndowmentImpl.address,
            action: FacetCutAction.Replace,
            functionSelectors: getSelectors(accountsCreateEndowmentImpl),
        }

        const diamondCut = DiamondCutFacet__factory.connect(addresses.accounts.diamond, proxyAdmin)

        const tx = await diamondCut.diamondCut([curDiamondCut], addresses.accounts.diamond, "0x")
        await hre.ethers.provider.waitForTransaction(tx.hash)

        // // Confirm that the diamond facet is using the new implementation
        const diamondLoupe = DiamondLoupeFacet__factory.connect(addresses.accounts.diamond, proxyAdmin)
        const sampleFunctionSelector = curDiamondCut.functionSelectors[0]
        const facetAddress = await diamondLoupe.facetAddress(sampleFunctionSelector)
        console.log("New Diamond's AccountsCreateEndowment facet address: ", facetAddress)
    } catch (error) {
        console.log(`AccountsCreateEndowment facet upgrade failed, reason: ${error}`)
    }
})
