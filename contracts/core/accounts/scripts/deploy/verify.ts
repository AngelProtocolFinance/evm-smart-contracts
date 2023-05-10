import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import * as logger from "../../../../../utils/logger"
import { FacetCut } from "./types"

export default async function verify(
    diamondAddress: string,
    diamondCutAddress: string,
    facetCuts: FacetCut[],
    admin: SignerWithAddress,
    hre: HardhatRuntimeEnvironment
): Promise<void> {
    console.log("Verifying newly deployed facets...")

    for (const { facetName, cut } of facetCuts) {
        try {
            await hre.run("verify:verify", {
                address: cut.facetAddress,
                constructorArguments: [],
            })
            console.log(`${facetName} verified.`)
        } catch (error) {
            logger.out(`Failed to verify ${facetName} at ${cut.facetAddress}. Error: ${error}`, logger.Level.Warn)
        }
    }

    console.log("Verifying the Diamond...")

    try {
        await hre.run("verify:verify", {
            address: diamondAddress,
            constructorArguments: [admin.address, diamondCutAddress],
        })
    } catch (error) {
        logger.out(`Failed to verify Diamond at ${diamondAddress}. Error: ${error}`, logger.Level.Warn)
    }
}
