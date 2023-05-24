export type AddressObj = {
    accountsDiamond: string
    charityApplication: {
        proxy: string
        implementation: string
    }
    endowmentMultiSig: {
        EndowmentMultiSigEmitterProxy: string
        EndowmentMultiSigEmitterImplementation: string
        MultiSigWalletFactory: string
        MultiSigWalletImplementation: string
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
        proxy: string
        implementation: string
    }
    libraries: {
        STRING_LIBRARY: string
        ANGEL_CORE_STRUCT_LIBRARY: string
    }
    lockedWithdraw: {
        implementation: string
        proxy: string
    }
    multiSig: {
        ApplicationsMultiSigProxy: string
        APTeamMultiSigProxy: string
        ApplicationMultisigImplementation: string
        APTeamMultisigImplementation: string
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
        proxy: string
        implementation: string
    }
    swapRouter: {
        proxy: string
        implementation: string
    }
    tokens: {
        halo: string
        usdc: string
        weth: string
    }
}