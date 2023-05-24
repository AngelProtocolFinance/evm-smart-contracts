import fs from "fs"
import path from "path"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { AddressObj } from "./types"

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

export const getAddresses = async (hre: HardhatRuntimeEnvironment) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    return getAddressesByNetworkId(chainId)
}

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T => k in obj

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
    goldfinch: {
        liquidVault: "",
        lockedVault: ""
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
        halo: "",
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
        proxy: "",
        implementation: "",
    },
    charityApplication: {
        proxy: "",
        implementation: "",
    },
    swapRouter: {
        proxy: "",
        implementation: "",
    },
    indexFund: {
        proxy: "",
        implementation: "",
    },
    endowmentMultiSig: {
        EndowmentMultiSigEmitterProxy: "",
        EndowmentMultiSigEmitterImplementation: "",
        MultiSigWalletFactory: "",
        MultiSigWalletImplementation: "",
    },
    lockedWithdraw: {
        implementation: "",
        proxy: "",
    },
    HaloImplementations: {
        DonationMatchImplementation: "",
        DonationMatchAddress: {
            proxy: "",
            implementation: "",
        },
        SubDaoImplementation: "",
        subDaoERC20Implementation: "",
        subDaoveTokenImplementation: "",
        IncentivisedVotingLockupImplementation: "",
    },
}
