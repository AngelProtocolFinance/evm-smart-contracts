import { ethers } from "hardhat"
import { IAccounts__factory } from "typechain-types"

async function deploy() {
    const [_deployer, apTeam1] = await ethers.getSigners()

    const accountsAddress = "0xf725Ff6235D53dA06Acb4a70AA33206a1447D550"

    const accountsContract = IAccounts__factory.connect(
        accountsAddress,
        apTeam1
    )

    //NOTE: USE AP-1 Wallet
    const owner = "0xce551C1125BfCdAb88048854522D0B220f41A6Ff" //AP-TEAM 1
    const cw4_members = ["0xce551C1125BfCdAb88048854522D0B220f41A6Ff"] //AP-TEAM 1
    const endow_type = 1
    const subdao_flag = false
    const title = "Test Endowment"

    const newEndowment = {
        owner: owner,
        withdrawBeforeMaturity: true,
        maturityTime: Math.floor(Date.now() / 1000) + 1000,
        maturityHeight: 500,
        name: title,
        categories: {
            sdgs: [2],
            general: [],
        },
        tier: 3,
        endow_type: endow_type,
        logo: "Some fancy logo",
        image: "Nice banner image",
        cw4_members: cw4_members,
        kycDonorsOnly: true,
        cw3Threshold: {
            enumData: 1,
            data: {
                weight: 0,
                percentage: 10,
                threshold: 0,
                quorum: 0,
            },
        },
        cw3MaxVotingPeriod: {
            enumData: 1,
            data: {
                height: 0,
                time: Math.floor(Date.now() / 1000) + 1000,
            },
        },
        whitelistedBeneficiaries: [],
        whitelistedContributors: [],
        splitMax: 100,
        splitMin: 0,
        splitDefault: 50,
        earningsFee: {
            payoutAddress: ethers.constants.AddressZero,
            feePercentage: 0,
            active: false,
        },
        withdrawFee: {
            payoutAddress: ethers.constants.AddressZero,
            feePercentage: 0,
            active: false,
        },
        depositFee: {
            payoutAddress: ethers.constants.AddressZero,
            feePercentage: 0,
            active: false,
        },
        aumFee: {
            payoutAddress: ethers.constants.AddressZero,
            feePercentage: 0,
            active: false,
        },

        dao: {
            quorum: 10,
            threshold: 10,
            votingPeriod: 60 * 60 * 24 * 7,
            timelockPeriod: 60 * 60 * 24 * 365,
            expirationPeriod: 60 * 60 * 24 * 365,
            proposalDeposit: 0,
            snapshotPeriod: 10,
            token: {
                token: 2,
                data: {
                    existingCw20Data: ethers.constants.AddressZero,
                    newCw20InitialSupply: "100000",
                    newCw20Name: "TEST",
                    newCw20Symbol: "TEST",
                    bondingCurveCurveType: {
                        curve_type: 0,
                        data: {
                            value: 0,
                            scale: 0,
                            slope: 0,
                            power: 0,
                        },
                    },
                    bondingCurveName: "TEST",
                    bondingCurveSymbol: "TEST",
                    bondingCurveDecimals: 18,
                    bondingCurveReserveDenom: ethers.constants.AddressZero,
                    bondingCurveReserveDecimals: 18,
                    bondingCurveUnbondingPeriod: 10,
                },
            },
        },
        createDao: subdao_flag,
        proposalLink: 0,
        settingsController: {
            endowmentController: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            strategies: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            whitelistedBeneficiaries: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            whitelistedContributors: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            maturityWhitelist: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            maturityTime: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            profile: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            earningsFee: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            withdrawFee: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            depositFee: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            aumFee: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            kycDonorsOnly: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            name: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            image: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            logo: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            categories: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            splitToLiquid: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
            ignoreUserSplits: {
                ownerControlled: true,
                govControlled: true,
                modifiableAfterInit: true,
                delegate: {
                    Addr: ethers.constants.AddressZero,
                    expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
                },
            },
        },
        parent: ethers.constants.AddressZero,
        maturityWhitelist: [],
        ignoreUserSplits: false,
        splitToLiquid: {
            max: 100,
            min: 0,
            defaultSplit: 50,
        },
    }

    let tx = await accountsContract.createEndowment(newEndowment)
    console.log(tx)
}

deploy().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
