import fs from "fs"
import path from "path"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { AddressObj } from "./types"
import { getAddressesByNetworkId } from "./helpers"

export const cleanFile = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractsDir = path.join(__dirname, "../../")

            if (!fs.existsSync(contractsDir)) {
                throw new Error("No root directory.")
            }

            fs.writeFileSync(
                path.join(contractsDir, "contract-address.json"),
                JSON.stringify({ INFO: "ALL ADDRESS ARE MENTIONED INTO THIS FILE" }, undefined, 2)
            )
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

export const updateAddresses = async (addressObj: Partial<AddressObj>, hre: HardhatRuntimeEnvironment) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId

    const addresses = {
      [chainId]: {
        ...getAddressesByNetworkId(chainId),
        ...addressObj
      }
    }
    await saveFrontendFiles(addresses);
}

export const saveFrontendFiles = (addresses: Record<string, Partial<AddressObj>>) => {
    return new Promise(async (resolve, reject) => {
        try {
            const rootDir = path.join(__dirname, "../../")

            if (!fs.existsSync(rootDir)) {
                throw new Error("No root directory.")
            }

            const jsonData = fs.readFileSync(path.join(rootDir, "contract-address.json"), "utf-8")

            const data = JSON.parse(jsonData)

            Object.assign(data, addresses)

            fs.writeFileSync(path.join(rootDir, "contract-address.json"), JSON.stringify(data, undefined, 2))

            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}
