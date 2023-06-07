import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, logger, updateAddresses} from "utils";

import getFacetFactoryEntries from "contracts/core/accounts/scripts/deploy/getFacetFactoryEntries";

import {Facet} from "./types";

export default async function deployFacets(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  corestruct: string,
  hre: HardhatRuntimeEnvironment
): Promise<Facet[]> {
  logger.out("Deploying facets...");

  const facets: Facet[] = [];

  const facetEntries = await getFacetsToUpgrade(facetNames, diamondOwner, corestruct);

  for (const entry of facetEntries) {
    const facetName = getContractName(entry.factory);
    try {
      const facet = await entry.factory.deploy();
      await facet.deployed();
      logger.out(`${facetName} deployed: ${facet.address}`);

      await updateAddresses({accounts: {facets: {[entry.addressField]: facet.address}}}, hre);

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
    const factoryEntry = factoryEntries.find(
      (entry) => getContractName(entry.factory) === facetName
    );
    if (!factoryEntry) {
      throw new Error(`Nonexistent facet detected: ${facetName}.`);
    }
    return factoryEntry;
  });
  return facetsToUpgrade;
}
