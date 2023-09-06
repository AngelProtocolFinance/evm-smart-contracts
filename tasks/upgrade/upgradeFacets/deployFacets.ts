import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import getFacetFactoryEntries from "contracts/core/accounts/scripts/deploy/getFacetFactoryEntries";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {deploy, getContractName, logger, updateAddresses} from "utils";
import {Facet} from "./types";

export default async function deployFacets(
  facetNames: string[],
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Facet[]> {
  logger.out("Deploying facets...");

  const facets: Facet[] = [];

  const facetEntries = getFacetsToUpgrade(facetNames, deployer);

  for (const entry of facetEntries) {
    try {
      const facet = await deploy(entry.factory);

      await updateAddresses(
        {accounts: {facets: {[entry.addressField]: facet.contract.address}}},
        hre
      );

      facets.push({name: facet.contractName, contract: facet.contract});
    } catch (error) {
      logger.out(`Deployment failed, reason: ${error}`, logger.Level.Error);
    }
  }

  return facets;
}

function getFacetsToUpgrade(facetNames: string[], deployer: SignerWithAddress) {
  const factoryEntries = getFacetFactoryEntries(deployer);
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
