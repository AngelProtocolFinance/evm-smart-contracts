import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DiamondCutFacet__factory, DiamondInit__factory, Diamond__factory } from "../../../../../typechain-types"
import deployFacets from "./deployFacets"
import updateDiamond from "./updateDiamond"
import verify from "./verify"

export async function deployDiamond(
    owner: string,
    registrar: string,
    ANGEL_CORE_STRUCT: string,
    STRING_LIBRARY: string,
    hre: HardhatRuntimeEnvironment,
    verify_contracts = false
) {
    try {
        const [_deployer, diamondAdmin] = await hre.ethers.getSigners()
        const diamondCutAddress = await deployDiamondCutFacet(diamondAdmin)

        const diamondAddress = await _deployDiamond(diamondAdmin, diamondCutAddress)

        await deployDiamondInit(diamondAdmin)

        const cuts = await deployFacets(diamondAdmin, ANGEL_CORE_STRUCT, STRING_LIBRARY)

        await updateDiamond(diamondAddress, diamondAdmin, owner, registrar, cuts, hre)

        if (verify_contracts) {
            await verify(diamondAddress, diamondCutAddress, cuts, diamondAdmin, hre)
        }

        return Promise.resolve(diamondAddress)
    } catch (error) {
        return Promise.reject(error)
    }
}

async function deployDiamondCutFacet(admin: SignerWithAddress): Promise<string> {
    const DiamondCutFacet = new DiamondCutFacet__factory(admin)
    const diamondCutFacet = await DiamondCutFacet.deploy()
    await diamondCutFacet.deployed()
    console.log("DiamondCutFacet deployed:", diamondCutFacet.address)
    return diamondCutFacet.address
}

async function _deployDiamond(admin: SignerWithAddress, diamondCut: string): Promise<string> {
    const Diamond = new Diamond__factory(admin)
    const diamond = await Diamond.deploy(admin.address, diamondCut)
    await diamond.deployed()
    console.log("Diamond deployed:", diamond.address)
    return diamond.address
}

/**
 * DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
 * Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
 * @param admin signer representing administrator of the contract
 */
async function deployDiamondInit(admin: SignerWithAddress): Promise<string> {
    const DiamondInit = new DiamondInit__factory(admin)
    const diamondInit = await DiamondInit.deploy()
    await diamondInit.deployed()
    console.log("DiamondInit deployed:", diamondInit.address, "\n")
    return diamondInit.address
}
