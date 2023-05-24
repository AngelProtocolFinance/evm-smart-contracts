import fs from "fs"
import path from "path"
import { HardhatRuntimeEnvironment } from "hardhat/types"

export const cleanFile = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractsDir = path.join(__dirname, "../")

            if (!fs.existsSync(contractsDir)) {
                fs.mkdirSync(contractsDir)
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

export type AddressObj = {
    libraries: {
        STRING_LIBRARY: string
        ANGEL_CORE_STRUCT_LIBRARY: string
    }
    accountsDiamond: string
    fundraising: {
        implementation: string
        library: string
        proxy: string
    }
    giftcards: {
        implementation: string
        proxy: string
    }
    registrar: {
        implementation: string
        proxy: string
    }
    router: {
        implementation: string
        proxy: string
    }
    tokens: {
        usdc: string
        weth: string
    }
    multiSig: {
        ApplicationsMultiSigProxy: string
        APTeamMultiSigProxy: string
        ApplicationMultisigImplementation: string
        APTeamMultisigImplementation: string
    }
    subDaoEmitter: {
        SubdaoEmitterProxyAddress: string
        SubdaoEmitterImplementationAddress: string
    }
    charityApplication: {
        CharityApplicationProxy: string
        CharityApplicationImplementation: string
    }
    swapRouterAddress2: {
        swapRouterProxy: string
        swapRouterImplementation: string
    }
    indexFundAddress: {
        indexFundProxy: string
        indexFundImplementation: string
    }
    EndowmentMultiSigAddress: {
        EndowmentMultiSigEmitterProxy: string
        EndowmentMultiSigEmitterImplementation: string
        MultiSigWalletFactory: string
        MultiSigWalletImplementation: string
    }
    lockedWithdraw: {
        LockedWithdrawImplementation: string
        LockedWithdrawProxy: string
    }
    HaloImplementations: {
        DonationMatchImplementation: string
        DonationMatchAddress: {
            DonationMatchProxy: string
            DonationMatchImplementation: string
        }
        SubDaoImplementation: string
        subDaoERC20Implementation: string
        subDaoveTokenImplementation: string
        IncentivisedVotingLockupImplementation: string
    }
}

const emptyAddressObj: AddressObj = {
    libraries: {
        STRING_LIBRARY: "",
        ANGEL_CORE_STRUCT_LIBRARY: "",
    },
    accountsDiamond: "",
    fundraising: {
        implementation: "",
        library: "",
        proxy: "",
    },
    giftcards: {
        implementation: "",
        proxy: "",
    },
    registrar: {
        implementation: "",
        proxy: "",
    },
    router: {
        implementation: "",
        proxy: "",
    },
    tokens: {
        usdc: "",
        weth: ""
    },
    multiSig: {
        ApplicationsMultiSigProxy: "",
        APTeamMultiSigProxy: "",
        ApplicationMultisigImplementation: "",
        APTeamMultisigImplementation: "",
    },
    subDaoEmitter: {
        SubdaoEmitterProxyAddress: "",
        SubdaoEmitterImplementationAddress: "",
    },
    charityApplication: {
        CharityApplicationProxy: "",
        CharityApplicationImplementation: "",
    },
    swapRouterAddress2: {
        swapRouterProxy: "",
        swapRouterImplementation: "",
    },
    indexFundAddress: {
        indexFundProxy: "",
        indexFundImplementation: "",
    },
    EndowmentMultiSigAddress: {
        EndowmentMultiSigEmitterProxy: "",
        EndowmentMultiSigEmitterImplementation: "",
        MultiSigWalletFactory: "",
        MultiSigWalletImplementation: "",
    },
    lockedWithdraw: {
        LockedWithdrawImplementation: "",
        LockedWithdrawProxy: "",
    },
    HaloImplementations: {
        DonationMatchImplementation: "",
        DonationMatchAddress: {
            DonationMatchProxy: "",
            DonationMatchImplementation: "",
        },
        SubDaoImplementation: "",
        subDaoERC20Implementation: "",
        subDaoveTokenImplementation: "",
        IncentivisedVotingLockupImplementation: "",
    },
}

export const getAddresses = async (hre: HardhatRuntimeEnvironment) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return getAddressesByNetworkId(chainId)
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

export const getAddressesByNetworkId = (networkId: string | symbol | number) => {
    const addresses = readAllAddresses()

    const key = String(networkId)
    
    if (hasKey(addresses, key)) {
        return new Proxy(addresses[key], {
            get: (target, prop) => {
                const contractKey = String(prop)
                if (hasKey(target, contractKey) && !!target[contractKey]) {
                    return target[contractKey]
                } else {
                    throw new Error(`Contract ${contractKey} not deployed on ${key}`)
                }
            }
        })
    } else {
        // throw new Error(`No contracts deployed to network ID: ${key}`)
        return structuredClone(emptyAddressObj)
    }
}

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T => k in obj

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
            const rootDir = path.join(__dirname, "../")

            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir)
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
