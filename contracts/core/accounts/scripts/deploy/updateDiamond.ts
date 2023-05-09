import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DiamondCutFacet__factory, DiamondInit__factory } from "../../../../../typechain-types"
import { FacetCut } from "./types"

export default async function updateDiamond(
    address: string,
    admin: SignerWithAddress,
    owner: string,
    registrar: string,
    facetCuts: FacetCut[],
    hre: HardhatRuntimeEnvironment
) {
    console.log("Updating Diamond facets...")

    const diamondCut = DiamondCutFacet__factory.connect(address, admin)
    const diamondInit = DiamondInit__factory.connect(address, admin)
    const calldata = diamondInit.interface.encodeFunctionData("init", [owner, registrar])

    const cuts = facetCuts.map((x) => x.cut)

    const tx = await diamondCut.diamondCut(cuts, diamondInit.address, calldata)
    console.log("Cutting diamond tx: ", tx.hash)

    const receipt = await hre.ethers.provider.waitForTransaction(tx.hash)

    if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }

    console.log("Completed diamond cut.")
}
