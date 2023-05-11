import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DiamondCutFacet__factory, DiamondInit__factory } from "../../../typechain-types"
import { logger } from "../../../utils"
import { FacetCut } from "./types"

export default async function cutDiamond(
    diamondAddress: string,
    diamondOwner: SignerWithAddress,
    facetCuts: FacetCut[],
    hre: HardhatRuntimeEnvironment
) {
    logger.out("Updating Diamond with new facet addresses...")

    const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, diamondOwner)
    const diamondInit = DiamondInit__factory.connect(diamondAddress, diamondOwner)
    const cuts = facetCuts.map((x) => x.cut)
    const tx = await diamondCut.diamondCut(cuts, diamondInit.address, "0x")
    await hre.ethers.provider.waitForTransaction(tx.hash)
}
