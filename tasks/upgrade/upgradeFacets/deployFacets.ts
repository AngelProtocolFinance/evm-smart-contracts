import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ContractFactory } from "ethers"
import { FacetCutAction, getSelectors } from "contracts/core/accounts/scripts/libraries/diamond"
import {
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
    AccountsVaultFacet__factory,
    AxelarExecutionContract__factory,
} from "typechain-types"
import { getContractName, logger } from "utils"
import { FacetCut } from "./types"

export default async function deployFacets(
    facetNames: string[],
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<FacetCut[]> {
    const cuts: FacetCut[] = []

    logger.out("Instantiating factories...")

    const facetFactories = await getFacetFactories(facetNames, diamondOwner, corestruct, stringlib)

    logger.out("Deploying all facets that use AccountStorage struct...")

    for (const facetFactory of facetFactories) {
        const { facetName, factory } = facetFactory
        try {
            const facet = await factory.deploy()
            await facet.deployed()
            logger.out(`${facetName} deployed: ${facet.address}`)
            cuts.push({
                facetName,
                cut: {
                    facetAddress: facet.address,
                    action: FacetCutAction.Replace,
                    functionSelectors: getSelectors(facet),
                },
            })
        } catch (error) {
            logger.out(`Failed to deploy ${facetName}, reason: ${error}`, logger.Level.Error)
        }
    }
    return cuts
}

type FacetFactory = { facetName: string; factory: ContractFactory }

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
async function getFacetFactories(
    facetNames: string[],
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<FacetFactory[]> {
    const factories: FacetFactory[] = []
    const nonExistentFacets: string[] = []

    facetNames.forEach((facetName) => {
        const factory = getFacetFactory(facetName, diamondOwner, corestruct, stringlib)
        if (typeof factory === "string") {
            nonExistentFacets.push(factory)
        } else {
            factories.push({ facetName, factory })
        }
    })

    if (!nonExistentFacets.length) {
        return factories
    }

    throw new Error(`Nonexistent facets detected: ${nonExistentFacets.join(", ")}.`)
}

function getFacetFactory(
    facetName: string,
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): ContractFactory | string {
    switch (facetName) {
        // no lib
        case getContractName(AccountsAllowance__factory):
            return new AccountsAllowance__factory(diamondOwner)
        case getContractName(AccountsDAOEndowments__factory):
            return new AccountsDAOEndowments__factory(diamondOwner)
        case getContractName(AccountDonationMatch__factory):
            return new AccountDonationMatch__factory(diamondOwner)
        case getContractName(AccountsStrategiesCopyEndowments__factory):
            return new AccountsStrategiesCopyEndowments__factory(diamondOwner)
        // core lib
        case getContractName(AccountsCreateEndowment__factory):
            return new AccountsCreateEndowment__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getContractName(AccountsQueryEndowments__factory):
            return new AccountsQueryEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getContractName(AccountsSwapEndowments__factory):
            return new AccountsSwapEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getContractName(AccountsUpdateEndowments__factory):
            return new AccountsUpdateEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getContractName(AccountsUpdateEndowmentSettingsController__factory):
            return new AccountsUpdateEndowmentSettingsController__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getContractName(AxelarExecutionContract__factory):
            return new AxelarExecutionContract__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        // string lib
        case getContractName(AccountsStrategiesUpdateEndowments__factory):
            return new AccountsStrategiesUpdateEndowments__factory(
                { "contracts/lib/Strings/string.sol:StringArray": stringlib },
                diamondOwner
            )
        case getContractName(AccountsUpdateStatusEndowments__factory):
            return new AccountsUpdateStatusEndowments__factory(
                { "contracts/lib/Strings/string.sol:StringArray": stringlib },
                diamondOwner
            )
        // all libs
        case getContractName(AccountDepositWithdrawEndowments__factory):
            return new AccountDepositWithdrawEndowments__factory(
                {
                    "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                    "contracts/lib/Strings/string.sol:StringArray": stringlib,
                },
                diamondOwner
            )
        case getContractName(AccountsVaultFacet__factory):
            return new AccountsVaultFacet__factory(
                {
                    "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                    "contracts/lib/Strings/string.sol:StringArray": stringlib,
                },
                diamondOwner
            )
        default:
            return facetName
    }
}
