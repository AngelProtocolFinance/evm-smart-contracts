import {getSelectors} from "contracts/core/accounts/scripts/libraries/diamond";
import {DiamondLoupeFacet} from "typechain-types";
import {ADDRESS_ZERO, logger} from "utils";
import {Facet} from "../types";

export default async function getFacetSelectors(
  facet: Facet,
  loupe: DiamondLoupeFacet
): Promise<{toAdd: string[]; toRemove: string[]; toReplace: string[]}> {
  const allSelectors = getSelectors(facet.contract);

  const toAdd: string[] = [];
  const toReplace: string[] = [];
  const toRemove: string[] = [];

  // To get selectors that need to be removed, we need to confirm that the facet itself
  // was already added and store its address
  let curFacetAddress = "";

  // For each selector decide whether it needs to be added or replaced
  for (let j = 0; j < allSelectors.length; j++) {
    const selector = allSelectors[j];
    try {
      const address = await loupe.facetAddress(selector);

      // if there's no facet address for a given selector then this is a new selector
      if (address === ADDRESS_ZERO) {
        toAdd.push(selector);
        continue;
      }

      // if there IS a facet address for a given selector then the appropriate function was updated
      toReplace.push(selector);

      // store the existing facet address as it will be necessary for checking which selectors to remove
      if (!curFacetAddress) {
        curFacetAddress = address;
      }
    } catch (error) {
      logger.out(`Error occurred getting facet address for selector ${selector}, reason: ${error}`);
    }
  }

  // To get selectors that need to be removed it is enough to go through all the existing selectors
  // and remove all those that do not exist in the most recently deployed facet contract
  if (!!curFacetAddress) {
    const curSelectors = await loupe.facetFunctionSelectors(curFacetAddress);
    curSelectors.forEach((curSelector) => {
      if (!allSelectors.includes(curSelector)) {
        toRemove.push(curSelector);
      }
    });
  }

  return {toAdd, toRemove, toReplace};
}
