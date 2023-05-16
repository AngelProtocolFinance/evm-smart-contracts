import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ContractFactory } from "ethers"
import {
    AccountDeployContract__factory,
    AccountDepositWithdrawEndowments__factory,
    AccountDonationMatch__factory,
    AccountsAllowance__factory,
    AccountsCreateEndowment__factory,
    AccountsDAOEndowments__factory,
    AccountsQueryEndowments__factory,
    AccountsStrategiesCopyEndowments__factory,
    AccountsSwapEndowments__factory,
    AccountsUpdateEndowmentSettingsController__factory,
    AccountsUpdateEndowments__factory,
    AccountsUpdateStatusEndowments__factory,
    AccountsUpdate__factory,
    AccountsVaultFacet__factory,
    AxelarExecutionContract__factory,
    DiamondLoupeFacet__factory,
    OwnershipFacet__factory,
} from "typechain-types"
import { logger } from "utils"
import { FacetCutAction, getSelectors } from "../libraries/diamond"
import { FacetCut } from "./types"

export default async function deployFacets(
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<FacetCut[]> {
    console.log("Deploying facets...")

    const cuts: FacetCut[] = []

    console.log("Instantiating factories...")

    const factories = await getFactories(diamondOwner, corestruct)

    for (const Factory of factories) {
        const contractName = Factory.constructor.name.replace("__factory", "")
        try {
            const facet = await Factory.deploy()
            await facet.deployed()
            console.log(`${contractName} deployed: ${facet.address}`)
            cuts.push({
                facetName: contractName,
                cut: {
                    facetAddress: facet.address,
                    action: FacetCutAction.Add,
                    functionSelectors: getSelectors(facet),
                },
            })
        } catch (error) {
            logger.out(`Failed to deploy ${contractName}, reason: ${error}`, logger.Level.Error)
        }
    }

    console.log("\nDiamond Cut:", cuts)

    return cuts
}

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
async function getFactories(
    diamondOwner: SignerWithAddress,
    corestruct: string
): Promise<ContractFactory[]> {
    const factories = [
        // no lib
        new AccountDeployContract__factory(diamondOwner),
        new AccountsAllowance__factory(diamondOwner),
        new AccountsDAOEndowments__factory(diamondOwner),
        new AccountDonationMatch__factory(diamondOwner),
        new AccountsStrategiesCopyEndowments__factory(diamondOwner),
        new AccountsUpdate__factory(diamondOwner),
        new AccountsQueryEndowments__factory(diamondOwner),
        new AccountsVaultFacet__factory(diamondOwner),
        new AxelarExecutionContract__factory(diamondOwner),
        new AccountsUpdateStatusEndowments__factory(diamondOwner),
        // core lib
        new AccountsCreateEndowment__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsSwapEndowments__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsUpdateEndowments__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AccountsUpdateEndowmentSettingsController__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AccountDepositWithdrawEndowments__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": corestruct,
            },
            diamondOwner
        ),
        new DiamondLoupeFacet__factory(diamondOwner),
        new OwnershipFacet__factory(diamondOwner),
    ]
    return factories
}
