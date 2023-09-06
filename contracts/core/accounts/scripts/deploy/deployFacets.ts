import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {deploy, logger, updateAddresses} from "utils";
import {FacetCutAction, getSelectors} from "../libraries/diamond";
import getFacetFactoryEntries from "./getFacetFactoryEntries";
import {FacetCut} from "./types";

export default async function deployFacets(
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<FacetCut[]> {
  logger.out("Deploying facets...");

  const cuts: FacetCut[] = [];

  const factoryEntries = getFacetFactoryEntries();

  for (const entry of factoryEntries) {
    try {
      const facet = await deploy(entry.factory, deployer);

      await updateAddresses(
        {accounts: {facets: {[entry.addressField]: facet.contract.address}}},
        hre
      );

      cuts.push({
        facetName: facet.contractName,
        cut: {
          facetAddress: facet.contract.address,
          action: FacetCutAction.Add,
          functionSelectors: getSelectors(facet.contract),
        },
      });
    } catch (error) {
      logger.out(`Deployment failed, reason: ${error}`, logger.Level.Error);
    }
  }

  return cuts;
}
