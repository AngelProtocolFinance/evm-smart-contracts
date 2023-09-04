import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import getFacetFactoryEntries from "contracts/core/accounts/scripts/deploy/getFacetFactoryEntries";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, logger, updateAddresses} from "utils";
import {Facet} from "./types";

export default async function deployFacets(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Facet[]> {
  logger.out("Deploying facets...");

  const facets: Facet[] = [];

  const facetEntries = getFacetsToUpgrade(facetNames, diamondOwner);

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

function getFacetsToUpgrade(facetNames: string[], diamondOwner: SignerWithAddress) {
  const factoryEntries = getFacetFactoryEntries(diamondOwner);
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
