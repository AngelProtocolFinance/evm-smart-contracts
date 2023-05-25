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

export async function getAddresses(hre: HardhatRuntimeEnvironment): Promise<AddressObj> {
    const chainId = await getChainId(hre)
    return getAddressesByNetworkId(chainId)
}

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export async function updateAddresses(partial: DeepPartial<AddressObj>, hre: HardhatRuntimeEnvironment) {
    const chainId = await getChainId(hre)

    const currentAddressObj = getAddressesByNetworkId(chainId)

    const updated = updateInternal(currentAddressObj, partial)

    await saveFrontendFiles({ [chainId]: updated })
}

function updateInternal<T>(original: T, partial: DeepPartial<T>): T {
    // if value to update is not an object, no need to go deeper
    if (typeof partial !== "object") {
        return partial
    }

    const updated: T = { ...original }

    for (const key in partial) {
        updated[key] = updateInternal(original[key], partial[key]!)
    }

    return updated
}

async function getChainId(hre: HardhatRuntimeEnvironment): Promise<number> {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return chainId
}
