import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { utils } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DiamondCutFacet__factory, DiamondLoupeFacet__factory } from "../../../typechain-types"
import * as logger from "../../../utils/logger"
import { FacetCut } from "./types"

export default async function verify(
    facetCuts: FacetCut[],
    diamondAddress: string,
    diamondOwner: SignerWithAddress,
    hre: HardhatRuntimeEnvironment
): Promise<void> {
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

    console.log("Verifying the updated Diamond...")

    // need to get the actual DiamondCut address by looking it up using its `diamondCut` function selector
    const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, diamondOwner)

    // generate the selector using the `diamondCut` function's ABI
    // https://docs.ethers.org/v5/api/utils/hashing/#utils-id
    const funcAbi = diamondCut.interface.functions["diamondCut((address,uint8,bytes4[])[],address,bytes)"].format()
    const diamondCutSelector = utils.id(funcAbi).substring(0, 10)

    const loupe = DiamondLoupeFacet__factory.connect(diamondAddress, diamondOwner)
    const diamondCutAddress = await loupe.facetAddress(diamondCutSelector)

    await hre.run("verify:verify", {
        address: diamondAddress,
        constructorArguments: [diamondOwner.address, diamondCutAddress],
    })
}
