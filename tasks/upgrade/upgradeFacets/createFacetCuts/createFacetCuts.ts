import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DiamondLoupeFacet__factory} from "typechain-types";
import {ADDRESS_ZERO, logger} from "utils";

import {FacetCutAction} from "contracts/core/accounts/scripts/libraries/diamond";

import {Facet, FacetCut} from "../types";
import getFacetSelectors from "./getFacetSelectors";

export default async function createFacetCuts(
  facets: Facet[],
  diamondAddress: string,
  diamondOwner: SignerWithAddress
): Promise<FacetCut[]> {
  logger.out("Creating facet cuts...");

  const facetCuts: FacetCut[] = [];

  const loupe = DiamondLoupeFacet__factory.connect(diamondAddress, diamondOwner);

  for (let i = 0; i < facets.length; i++) {
    const facet = facets[i];

    const {toAdd, toRemove, toReplace} = await getFacetSelectors(facet, loupe);

    if (toAdd.length > 0) {
      facetCuts.push({
        facetName: facet.name,
        cut: {
          facetAddress: facet.contract.address,
          action: FacetCutAction.Add,
          functionSelectors: toAdd,
        },
      });
    }
    if (toReplace.length > 0) {
      facetCuts.push({
        facetName: facet.name,
        cut: {
          facetAddress: facet.contract.address,
          action: FacetCutAction.Replace,
          functionSelectors: toReplace,
        },
      });
    }
    if (toRemove.length > 0) {
      facetCuts.push({
        facetName: facet.name,
        cut: {
          facetAddress: ADDRESS_ZERO,
          action: FacetCutAction.Remove,
          functionSelectors: toRemove,
        },
      });
    }
  }

  return facetCuts;
}
