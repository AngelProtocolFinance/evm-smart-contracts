import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getFacetFactoryEntries, logger, updateAddresses} from "utils";
import {FacetCutAction, getSelectors} from "../libraries/diamond";
import {FacetCut} from "./types";

export default async function deployFacets(
  diamondOwner: SignerWithAddress,
  corestruct: string,
  hre: HardhatRuntimeEnvironment
): Promise<FacetCut[]> {
  logger.out("Deploying facets...");

  const cuts: FacetCut[] = [];

  const factoryEntries = await getFacetFactoryEntries(diamondOwner, corestruct);

  for (const entry of factoryEntries) {
    const contractName = entry.factory.constructor.name.replace("__factory", "");
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
