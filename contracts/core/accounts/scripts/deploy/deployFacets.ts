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
    AccountsStrategiesUpdateEndowments__factory,
    AccountsSwapEndowments__factory,
    AccountsUpdateEndowmentSettingsController__factory,
    AccountsUpdateEndowments__factory,
    AccountsUpdateStatusEndowments__factory,
    AccountsUpdate__factory,
    AccountsVaultFacet__factory,
    AxelarExecutionContract__factory,
    DiamondLoupeFacet__factory,
    OwnershipFacet__factory,
} from "../../../../../typechain-types"
import * as logger from "../../../../../utils/logger"
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

    const factories = await getFactories(diamondOwner, corestruct, stringlib)

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
                    action: FacetCutAction.Replace,
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
    corestruct: string,
    stringlib: string
): Promise<ContractFactory[]> {
    const factories = [
        // no lib
        new AccountDeployContract__factory(diamondOwner),
        new AccountsAllowance__factory(diamondOwner),
        new AccountsDAOEndowments__factory(diamondOwner),
        new AccountDonationMatch__factory(diamondOwner),
        new AccountsStrategiesCopyEndowments__factory(diamondOwner),
        new AccountsUpdate__factory(diamondOwner),
        // core lib
        new AccountsCreateEndowment__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsQueryEndowments__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsSwapEndowments__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsUpdateEndowments__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AccountsUpdateEndowmentSettingsController__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AxelarExecutionContract__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        // string lib
        new AccountsStrategiesUpdateEndowments__factory(
            { "contracts/lib/Strings/string.sol:StringArray": stringlib },
            diamondOwner
        ),
        new AccountsUpdateStatusEndowments__factory(
            { "contracts/lib/Strings/string.sol:StringArray": stringlib },
            diamondOwner
        ),
        // all libs
        new AccountDepositWithdrawEndowments__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                "contracts/lib/Strings/string.sol:StringArray": stringlib,
            },
            diamondOwner
        ),
        new AccountsVaultFacet__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                "contracts/lib/Strings/string.sol:StringArray": stringlib,
            },
            diamondOwner
        ),
        new DiamondLoupeFacet__factory(diamondOwner),
        new OwnershipFacet__factory(diamondOwner),
    ]
    return factories
}
