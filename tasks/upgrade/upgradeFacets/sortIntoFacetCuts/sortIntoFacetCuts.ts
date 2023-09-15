import {FacetCutAction} from "contracts/core/accounts/scripts/libraries/diamond";
import {ContractFactory, Signer} from "ethers";
import {DiamondLoupeFacet__factory} from "typechain-types";
import {Deployment} from "types";
import {ADDRESS_ZERO, logger} from "utils";
import {FacetCut} from "../types";
import getFacetSelectors from "./getFacetSelectors";

export default async function sortIntoFacetCuts(
  facetDeployments: Deployment<ContractFactory>[],
  diamondAddress: string,
  diamondOwner: Signer
): Promise<FacetCut[]> {
  logger.out("Creating facet cuts...");

  const facetCuts: FacetCut[] = [];

  const loupe = DiamondLoupeFacet__factory.connect(diamondAddress, diamondOwner);

  for (let i = 0; i < facetDeployments.length; i++) {
    const facetDeployment = facetDeployments[i];

    const {toAdd, toRemove, toReplace} = await getFacetSelectors(facetDeployment.contract, loupe);

    if (toAdd.length > 0) {
      facetCuts.push({
        deployment: facetDeployment,
        cut: {
          facetAddress: facetDeployment.contract.address,
          action: FacetCutAction.Add,
          functionSelectors: toAdd,
        },
      });
    }
    if (toReplace.length > 0) {
      facetCuts.push({
        deployment: facetDeployment,
        cut: {
          facetAddress: facetDeployment.contract.address,
          action: FacetCutAction.Replace,
          functionSelectors: toReplace,
        },
      });
    }
    if (toRemove.length > 0) {
      facetCuts.push({
        deployment: facetDeployment,
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
