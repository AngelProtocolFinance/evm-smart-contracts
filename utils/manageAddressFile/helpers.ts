import fs from "fs"
import path from "path"
import { AddressObj } from "./types"

const rootDir = path.join(__dirname, "../../")

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

export function readAllAddresses() {
    if (!fs.existsSync(rootDir)) {
        throw new Error("No root directory.")
    }

    const jsonData = fs.readFileSync(path.join(rootDir, "contract-address.json"), "utf-8")

    const data: Record<string, AddressObj> = JSON.parse(jsonData)

    return data
}

export function saveFrontendFiles(addresses: Record<string, AddressObj>) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = readAllAddresses()

            Object.assign(data, addresses)

            fs.writeFileSync(path.join(rootDir, "contract-address.json"), JSON.stringify(data, undefined, 2))

            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

function hasKey<T extends object>(obj: T, k: keyof any): k is keyof T {
    return k in obj
}

function createEmpty(): AddressObj {
    return {
        accounts: {
            diamond: "",
            facets: {
                accountDeployContract: "",
                accountDepositWithdrawEndowments: "",
                accountDonationMatch: "",
                accountsAllowance: "",
                accountsCreateEndowment: "",
                accountsDAOEndowments: "",
                accountsQueryEndowments: "",
                accountsSwapEndowments: "",
                accountsUpdate: "",
                accountsUpdateEndowments: "",
                accountsUpdateEndowmentSettingsController: "",
                accountsUpdateStatusEndowments: "",
                accountsVaultFacet: "",
                diamondCutFacet: "",
                diamondInitFacet: "",
                diamondLoupeFacet: "",
                ownershipFacet: "",
                reentrancyGuardFacet: "",
            },
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
