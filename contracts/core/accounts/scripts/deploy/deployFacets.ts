import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger, updateAddresses} from "utils";
import {FacetCutAction, getSelectors} from "../libraries/diamond";
import getFactoryData from "./getFactoryData";
import {FacetCut} from "./types";

export default async function deployFacets(
  diamondOwner: SignerWithAddress,
  corestruct: string,
  hre: HardhatRuntimeEnvironment
): Promise<FacetCut[]> {
  logger.out("Deploying facets...");

  const cuts: FacetCut[] = [];

  logger.out("Instantiating factories...");

  const factoryData = await getFactoryData(diamondOwner, corestruct);

  for (const entry of factoryData) {
    const contractName = entry.factory.constructor.name.replace("__factory", "");
    try {
      logger.out(`Deploying ${contractName}...`);
      const facet = await entry.factory.deploy();
      await facet.deployed();
      logger.out(`Deployed at: ${facet.address}`);

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
