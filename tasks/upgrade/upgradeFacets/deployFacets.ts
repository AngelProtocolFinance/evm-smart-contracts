import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import getFacetFactoryEntries from "contracts/core/accounts/scripts/deploy/getFacetFactoryEntries";
import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Deployment} from "types";
import {deploy, getContractName, logger, updateAddresses} from "utils";

export default async function deployFacets(
  facetNames: string[],
  diamondOwner: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<ContractFactory>[]> {
  logger.out("Deploying facets...");

  const facetDeployments: Deployment<ContractFactory>[] = [];

  const facetEntries = getFacetsToUpgrade(facetNames, diamondOwner);

  for (const entry of facetEntries) {
    try {
      const deployment = await deploy(entry.factory);

      await updateAddresses(
        {accounts: {facets: {[entry.addressField]: deployment.contract.address}}},
        hre
      );

      facetDeployments.push(deployment);
    } catch (error) {
      logger.out(`Deployment failed, reason: ${error}`, logger.Level.Error);
    }
  }

  return facetDeployments;
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
