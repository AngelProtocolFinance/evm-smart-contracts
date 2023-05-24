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