import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import addresses from "contract-address.json"
import { AccountsCreateEndowment, AccountsQueryEndowments, MultiSigGeneric, Registrar } from "typechain-types"
import { AccountMessages } from "typechain-types/contracts/core/accounts/IAccounts"
import { genWallet } from "utils"

task("manage:createCharityEndowment", "Will create a new charity endowment").setAction(
    async (_taskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            let apTeam2: SignerWithAddress
            let apTeam3: SignerWithAddress
            [deployer, apTeam1, apTeam2, apTeam3] =
                await hre.ethers.getSigners()



            let createEndowmentFacet = await hre.ethers.getContractAt(
                                        "AccountsCreateEndowment",
                                        addresses.accounts.diamond) as AccountsCreateEndowment
            let queryEndowmentFacet = await hre.ethers.getContractAt(
                                        "AccountsQueryEndowments",
                                        addresses.accounts.diamond) as AccountsQueryEndowments

                 
            // let createEndowmentFacet = await AccountsCreateEndowment__factory
            //                         .connect(addresses.accounts.diamond, apTeam1)

            // let config = await queryEndowmentFacet.queryConfig()
            // console.log(config)
            // let endowmentDetails = await queryEndowmentFacet.queryEndowmentDetails(0)
            // console.log(endowmentDetails)


            console.log("Generating new wallet as owner")
            let wallet = genWallet(true)

            let endowState = await queryEndowmentFacet.queryEndowmentDetails(37) // Charity #1

            let currDetails: AccountMessages.CreateEndowmentRequestStruct = {
                owner: wallet.address, 
                withdrawBeforeMaturity: false, 
                maturityTime: 0,
                maturityHeight: 0,
                name: "Test Charity Endowment #3",
                categories: {
                    sdgs: [1],
                    general: []
                },
                tier: 3,
                endowType: 0, // Charity
                logo: "",
                image: "",
                members: [wallet.address, endowState.owner],
                threshold: {
                    enumData: 0,
                    data: {
                        weight: 0,
                        percentage: 0,
                        threshold: 0,
                        quorum: 1
                    }
                },
                maxVotingPeriod: {
                    enumData: 0,
                    data: {
                        height: 0,
                        time: 0
                    }
                },
                allowlistedBeneficiaries: [wallet.address, apTeam2.address],
                allowlistedContributors: [wallet.address, apTeam2.address],
                splitMax: 100,
                splitMin: 0,
                splitDefault: 50,
                earningsFee: {
                    payoutAddress: apTeam1.address,
                    feePercentage: 2,
                    active: true
                },
                withdrawFee: {
                    payoutAddress: apTeam1.address,
                    feePercentage: 2,
                    active: true
                },
                depositFee: {
                    payoutAddress: apTeam1.address,
                    feePercentage: 2,
                    active: true
                },
                balanceFee: {
                    payoutAddress: apTeam1.address,
                    feePercentage: 2,
                    active: true
                },
                dao: {
                    quorum: 1,
                    threshold: 1,
                    votingPeriod: 0,
                    timelockPeriod: 0,
                    expirationPeriod: 0,
                    proposalDeposit: 0,
                    snapshotPeriod: 0,
                    token: {
                        token: 0,
                        data: {
                            existingCw20Data: apTeam1.address,
                            newCw20InitialSupply: 0,
                            newCw20Name: "",
                            newCw20Symbol: "",
                            bondingCurveCurveType: {
                                curve_type: 0,
                                data: {
                                    value: 0,
                                    scale: 0,
                                    slope: 0,
                                    power: 0
                                }
                            },
                            bondingCurveName: "",
                            bondingCurveSymbol: "",
                            bondingCurveDecimals: 18,
                            bondingCurveReserveDenom: apTeam1.address,
                            bondingCurveReserveDecimals: 18,
                            bondingCurveUnbondingPeriod: 0
                        }
                    }
                },
                createDao: false,
                proposalLink: 0,
                settingsController: {
                    endowmentController: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    strategies: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    allowlistedBeneficiaries: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    allowlistedContributors: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    maturityAllowlist: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    maturityTime: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    profile: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    earningsFee: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    withdrawFee: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    depositFee: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    balanceFee: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    name: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    image: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    logo: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    categories: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    splitToLiquid: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    },
                    ignoreUserSplits: {
                        modifiableAfterInit: true,
                        delegate: {
                            Addr: apTeam1.address,
                            expires: 0
                        }
                    }
                },
                parent: 0,
                maturityAllowlist: [wallet.address, apTeam2.address],
                ignoreUserSplits: false,
                splitToLiquid: {
                    max: 100,
                    min: 0,
                    defaultSplit: 50
                }
            }
            // let tx = await createEndowmentFacet.connect(apTeam1).createEndowment(currDetails)
            // await hre.ethers.provider.waitForTransaction(tx.hash)

            for (let i=1; i<1000; i++) {
                try {
                    let endowState = await queryEndowmentFacet.queryEndowmentDetails(i)
                    console.log(i, endowState.name, endowState.owner)
                    let multisig = await hre.ethers.getContractAt("MultiSigGeneric", endowState.owner) as MultiSigGeneric
                    for (let j=0; i<50; j++){
                        try {
                            console.log(await multisig.owners(j))
                        }
                        catch(error) {
                            break
                        }
                    }                    
                }
                catch(error) {
                    console.log(error)
                    return
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }
)
