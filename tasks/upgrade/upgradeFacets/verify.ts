import { HardhatRuntimeEnvironment } from "hardhat/types"
import * as logger from "../../../utils/logger"
import { FacetCut } from "./types"

export default async function verify(facetCuts: FacetCut[], hre: HardhatRuntimeEnvironment): Promise<void> {
    console.log("Verifying newly deployed facets...")

    for (const { facetName, cut } of facetCuts) {
        try {
            await hre.run("verify:verify", {
                address: cut.facetAddress,
                constructorArguments: [],
            })
        } catch (error) {
            logger.out(`Failed to verify ${facetName} at ${cut.facetAddress}, reason: ${error}`, logger.Level.Error)
        }
    }
}
