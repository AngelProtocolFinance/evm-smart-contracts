import fs from "fs"
import path from "path"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { AddressObj } from "./types"

export async function getAddresses(hre: HardhatRuntimeEnvironment) {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return getAddressesByNetworkId(chainId)
}

export function getAddressesByNetworkId(networkId: string | symbol | number): AddressObj {
    const addresses = readAllAddresses()

    const key = String(networkId)

    if (!hasKey(addresses, key)) {
        return createEmpty()
    }

    return new Proxy(addresses[key], {
        get: (target, prop) => {
            const contractKey = String(prop)
            if (hasKey(target, contractKey) && !!target[contractKey]) {
                return target[contractKey]
            }

            throw new Error(`Contract ${contractKey} not deployed on ${key}`)
        },
    })
}

const readAllAddresses = () => {
    const rootDir = path.join(__dirname, "../")

    if (!fs.existsSync(rootDir)) {
        throw new Error("No root directory.")
    }

    const jsonData = fs.readFileSync(path.join(rootDir, "contract-address.json"), "utf-8")

    const data: Record<string, AddressObj> = JSON.parse(jsonData)

    return data
}

function hasKey<T extends object>(obj: T, k: keyof any): k is keyof T {
    return k in obj
}

function createEmpty(): AddressObj {
    return {
        accounts: {
            diamond: "",
        },
        charityApplication: {
            implementation: "",
            proxy: "",
        },
        donationMatch: {
            implementation: "",
        },
        donationMatchCharity: {
            implementation: "",
            proxy: "",
        },
        fundraising: {
            implementation: "",
            library: "",
            proxy: "",
        },
        giftcards: {
            implementation: "",
            proxy: "",
        },
        goldfinch: {
            liquidVault: "",
            lockedVault: "",
        },
        incentivisedVotingLockup: {
            implementation: "",
        },
        indexFund: {
            implementation: "",
            proxy: "",
        },
        libraries: {
            ANGEL_CORE_STRUCT_LIBRARY: "",
            STRING_LIBRARY: "",
        },
        multiSig: {
            applications: {
                implementation: "",
                proxy: "",
            },
            apTeam: {
                implementation: "",
                proxy: "",
            },
            endowment: {
                emitter: {
                    implementation: "",
                    proxy: "",
                },
                factory: "",
                implementation: "",
            },
        },
        registrar: {
            implementation: "",
            proxy: "",
        },
        router: {
            implementation: "",
            proxy: "",
        },
        subDao: {
            emitter: {
                implementation: "",
                proxy: "",
            },
            implementation: "",
            token: "",
            veBondingToken: "",
        },
        swapRouter: {
            implementation: "",
            proxy: "",
        },
        tokens: {
            halo: "",
            usdc: "",
            weth: "",
        },
    }
}
