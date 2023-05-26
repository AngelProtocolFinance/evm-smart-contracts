import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger} from "utils";
import {FacetCut} from "./types";

export default async function verify(
  facetCuts: FacetCut[],
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  logger.out("Verifying newly deployed facets...");

  for (const {facetName, cut} of facetCuts) {
    try {
      logger.out(`Verifying ${facetName}...`);
      await hre.run("verify:verify", {
        address: cut.facetAddress,
        constructorArguments: [],
      });
    } catch (error) {
      logger.out(
        `Failed to verify ${facetName} at ${cut.facetAddress}, reason: ${error}`,
        logger.Level.Error
      );
    }
  }
}
