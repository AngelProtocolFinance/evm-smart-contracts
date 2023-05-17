import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { FacetCutAction, getSelectors } from "contracts/core/accounts/scripts/libraries/diamond"
import { DiamondLoupeFacet, DiamondLoupeFacet__factory } from "typechain-types"
import { ADDRESS_ZERO, logger } from "utils"
import { Facet, FacetCut } from "./types"

export default async function createFacetCuts(
    facets: Facet[],
    diamondAddress: string,
    diamondOwner: SignerWithAddress
): Promise<FacetCut[]> {
    logger.out("Creating facet cuts...")

    const facetCuts: FacetCut[] = []

    const loupe = DiamondLoupeFacet__factory.connect(diamondAddress, diamondOwner)

    for (let i = 0; i < facets.length; i++) {
        const facet = facets[i]

        const { toAdd, toRemove, toReplace } = await getFacetSelectors(facet, loupe)

        if (toAdd.length > 0) {
            facetCuts.push({
                facetName: facet.name,
                cut: {
                    facetAddress: facet.contract.address,
                    action: FacetCutAction.Add,
                    functionSelectors: toAdd,
                },
            })
        }
        if (toReplace.length > 0) {
            facetCuts.push({
                facetName: facet.name,
                cut: {
                    facetAddress: facet.contract.address,
                    action: FacetCutAction.Replace,
                    functionSelectors: toReplace,
                },
            })
        }
        if (toRemove.length > 0) {
            facetCuts.push({
                facetName: facet.name,
                cut: {
                    facetAddress: facet.contract.address,
                    action: FacetCutAction.Remove,
                    functionSelectors: toRemove,
                },
            })
        }
    }

    return facetCuts
}

async function getFacetSelectors(
    facet: Facet,
    loupe: DiamondLoupeFacet
): Promise<{ toAdd: string[]; toRemove: string[]; toReplace: string[] }> {
    const allSelectors = getSelectors(facet.contract)

    const toAdd: string[] = []
    const toReplace: string[] = []
    const toRemove: string[] = []

    // To get selectors that need to be removed, we need to confirm that the facet itself
    // was already added and store its address
    let curFacetAddress = ""

    for (let j = 0; j < allSelectors.length; j++) {
        const selector = allSelectors[j]
        try {
            const address = await loupe.facetAddress(selector)

            if (address === ADDRESS_ZERO) {
                toAdd.push(selector)
                continue
            }

            toReplace.push(selector)
            if (!curFacetAddress) {
                curFacetAddress = address
            }
        } catch (error) {
            logger.out(`Error occurred getting facet address for selector ${selector}, reason: ${error}`)
        }
    }

    // To get selectors that need to be removed it is enough to go through all the existing selectors
    // and remove all those that do not exist in the most recently deployed facet contract
    if (!!curFacetAddress) {
        const curSelectors = await loupe.facetFunctionSelectors(curFacetAddress)
        curSelectors.forEach((curSelector) => {
            if (!allSelectors.includes(curSelector)) {
                toRemove.push(curSelector)
            }
        })
    }

    return { toAdd, toRemove, toReplace }
}
