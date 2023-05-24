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
    goldfinch: {
        liquidVault: string
        lockedVault: string
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
        halo: string
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
        proxy: string
        implementation: string
    }
    charityApplication: {
        proxy: string
        implementation: string
    }
    swapRouterAddress2: {
        proxy: string
        implementation: string
    }
    indexFundAddress: {
        proxy: string
        implementation: string
    }
    EndowmentMultiSigAddress: {
        EndowmentMultiSigEmitterProxy: string
        EndowmentMultiSigEmitterImplementation: string
        MultiSigWalletFactory: string
        MultiSigWalletImplementation: string
    }
    lockedWithdraw: {
        implementation: string
        proxy: string
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
}