import { HardhatRuntimeEnvironment } from "hardhat/types"
import { getAddressesByNetworkId, readAllAddresses, saveFrontendFiles } from "./helpers"
import { AddressObj } from "./types"

/**
 * Removes contract address for the current network from the appropriate file.
 */
export async function cleanAddresses(hre: HardhatRuntimeEnvironment) {
    const chainId = await getChainId(hre)

    const allAddresses = readAllAddresses()

    const { [chainId]: toRemove, ...toRemain } = allAddresses

    await saveFrontendFiles(toRemain)
}

export async function getAddresses(hre: HardhatRuntimeEnvironment) {
    const chainId = await getChainId(hre)
    return getAddressesByNetworkId(chainId)
}

export async function updateAddresses(addressObj: Partial<AddressObj>, hre: HardhatRuntimeEnvironment) {
    const chainId = await getChainId(hre)

    const addresses = {
        [chainId]: {
            ...getAddressesByNetworkId(chainId),
            ...addressObj,
        },
    }
    await saveFrontendFiles(addresses)
}

async function getChainId(hre: HardhatRuntimeEnvironment): Promise<number> {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return chainId
}
