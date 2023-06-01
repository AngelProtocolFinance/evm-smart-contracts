import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {getContractName, getFacetFactoryEntries, logger} from "utils";
import {Facet} from "./types";

export default async function deployFacets(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  corestruct: string
): Promise<Facet[]> {
  logger.out("Deploying facets...");

  const facets: Facet[] = [];

  const facetsToUpgrade = await getFacetsToUpgrade(facetNames, diamondOwner, corestruct);

  for (const facetFactory of facetsToUpgrade) {
    const {addressField, factory} = facetFactory;
    const facetName = getContractName(factory);
    try {
      const facet = await factory.deploy();
      await facet.deployed();
      logger.out(`${facetName} deployed: ${facet.address}`);
      facets.push({name: facetName, contract: facet});
    } catch (error) {
      logger.out(`Failed to deploy ${facetName}, reason: ${error}`, logger.Level.Error);
    }
  }

  return facets;
}

async function getFacetsToUpgrade(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  corestruct: string
) {
  const factoryEntries = await getFacetFactoryEntries(diamondOwner, corestruct);
  const facetsToUpgrade = facetNames.map((facetName) => {
    const factoryEntry = factoryEntries.find((entry) => getContractName(entry.factory));
    if (!factoryEntry) {
      throw new Error(`Nonexistent facet detected: ${facetName}.`);
    }
    return factoryEntry;
  });
  return facetsToUpgrade;
}
