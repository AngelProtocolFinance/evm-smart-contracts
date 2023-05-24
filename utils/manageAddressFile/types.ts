export type AddressObj = {
    accounts: {
        diamond: string
    }
    charityApplication: {
        implementation: string
        proxy: string
    }
    fundraising: {
        implementation: string
        library: string
        proxy: string
    }
    giftcards: {
        implementation: string
        proxy: string
    }
    goldfinch: {
        liquidVault: string
        lockedVault: string
    }
    HaloImplementations: {
        DonationMatchImplementation: string
        DonationMatchAddress: {
            proxy: string
            implementation: string
        }
        SubDaoImplementation: string
        subDaoERC20Implementation: string
        subDaoveTokenImplementation: string
        IncentivisedVotingLockupImplementation: string
    }
    indexFund: {
        implementation: string
        proxy: string
    }
    libraries: {
        ANGEL_CORE_STRUCT_LIBRARY: string
        STRING_LIBRARY: string
    }
    lockedWithdraw: {
        implementation: string
        proxy: string
    }
    multiSig: {
        applications: {
            implementation: string
            proxy: string
        }
        apTeam: {
            implementation: string
            proxy: string
        }
        endowment: {
            emitter: {
                implementation: string
                proxy: string
            }
            factory: string
            implementation: string
        }
    }
    registrar: {
        implementation: string
        proxy: string
    }
    router: {
        implementation: string
        proxy: string
    }
    subDaoEmitter: {
        implementation: string
        proxy: string
    }
    swapRouter: {
        implementation: string
        proxy: string
    }
    tokens: {
        halo: string
        usdc: string
        weth: string
    }
}
