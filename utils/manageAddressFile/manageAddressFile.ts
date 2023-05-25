import fs from "fs"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import { getAddressesByNetworkId, saveFrontendFiles } from "./helpers"
import { AddressObj } from "./types"

export const cleanFile = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractsDir = path.join(__dirname, "../../")

            if (!fs.existsSync(contractsDir)) {
                throw new Error("No root directory.")
            }

            fs.writeFileSync(path.join(contractsDir, "contract-address.json"), "{}")
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

export async function getAddresses(hre: HardhatRuntimeEnvironment) {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return getAddressesByNetworkId(chainId)
}

export const updateAddresses = async (addressObj: Partial<AddressObj>, hre: HardhatRuntimeEnvironment) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId

    const addresses = {
        [chainId]: {
            ...getAddressesByNetworkId(chainId),
            ...addressObj,
        },
    }
    await saveFrontendFiles(addresses)
}
