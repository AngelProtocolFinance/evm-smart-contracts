import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {getContractName, getFacetFactoryEntries, logger, updateAddresses} from "utils";
import {Facet} from "./types";
import {HardhatRuntimeEnvironment} from "hardhat/types";

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
    const factoryEntry = factoryEntries.find((entry) => getContractName(entry.factory));
    if (!factoryEntry) {
      throw new Error(`Nonexistent facet detected: ${facetName}.`);
    }
    return factoryEntry;
  });
  return facetsToUpgrade;
}
