import {HardhatRuntimeEnvironment} from "hardhat/types";
import {deploy, logger, updateAddresses} from "utils";
import {FacetCutAction, getSelectors} from "../libraries/diamond";
import getFacetFactoryEntries from "./getFacetFactoryEntries";
import {FacetCut} from "./types";
import {Signer} from "ethers";

export default async function deployFacets(
  diamondOwner: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<FacetCut[]> {
  logger.out("Deploying facets...");

  const cuts: FacetCut[] = [];

  const factoryEntries = getFacetFactoryEntries(diamondOwner);

  for (const entry of factoryEntries) {
    try {
      const deployment = await deploy(entry.factory);

      await updateAddresses(
        {accounts: {facets: {[entry.addressField]: deployment.contract.address}}},
        hre
      );

      cuts.push({
        deployment: deployment,
        cut: {
          facetAddress: deployment.contract.address,
          action: FacetCutAction.Add,
          functionSelectors: getSelectors(deployment.contract),
        },
      });
    } catch (error) {
      logger.out(`Deployment failed, reason: ${error}`, logger.Level.Error);
    }
  }

  return cuts;
}
