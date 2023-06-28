import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, logger, updateAddresses} from "utils";

import {FacetCutAction, getSelectors} from "../libraries/diamond";
import getFacetFactoryEntries from "./getFacetFactoryEntries";
import {FacetCut} from "./types";

export default async function deployFacets(
  diamondOwner: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<FacetCut[]> {
  logger.out("Deploying facets...");

  const cuts: FacetCut[] = [];

  const factoryEntries = await getFacetFactoryEntries(diamondOwner);

  for (const entry of factoryEntries) {
    const contractName = getContractName(entry.factory);
    try {
      const facet = await entry.factory.deploy();
      await facet.deployed();
      logger.out(`${contractName} deployed at: ${facet.address}`);

      await updateAddresses({accounts: {facets: {[entry.addressField]: facet.address}}}, hre);

      cuts.push({
        facetName: contractName,
        cut: {
          facetAddress: facet.address,
          action: FacetCutAction.Add,
          functionSelectors: getSelectors(facet),
        },
      });
    } catch (error) {
      logger.out(`Failed to deploy ${contractName}, reason: ${error}`, logger.Level.Error);
    }
  }

  return cuts;
}
