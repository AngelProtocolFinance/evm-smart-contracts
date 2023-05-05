const { assert, expect } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const getCreateEndowmentConfig = async function (
	owner,
	cw4_members,
	endow_type = 1,
	subdao_flag = false,
	bondingCurveReserveDenom = ADDRESS_ZERO,
	title = 'Test Endowment'
) {
	try {
		var endowmentConfig = {
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
			logo: 'Some fancy logo',
			image: 'Nice banner image',
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
			allowlistedBeneficiaries: [],
			allowlistedContributors: [],
			splitMax: 100,
			splitMin: 0,
			splitDefault: 50,
			earningsFee: {
				payoutAddress: ADDRESS_ZERO,
				feePercentage: 0,
				active: false,
			},
			withdrawFee: {
				payoutAddress: ADDRESS_ZERO,
				feePercentage: 0,
				active: false,
			},
			depositFee: {
				payoutAddress: ADDRESS_ZERO,
				feePercentage: 0,
				active: false,
			},
			balanceFee: {
				payoutAddress: ADDRESS_ZERO,
				feePercentage: 0,
				active: false,
			},
			dao: {
				quorum: 10,
				threshold: 10,
				votingPeriod: 10,
				timelockPeriod: 10,
				expirationPeriod: 10,
				proposalDeposit: 10,
				snapshotPeriod: 10,
				token: {
					token: 1,
					data: {
						existingCw20Data: ADDRESS_ZERO,
						newCw20InitialSupply: '100000',
						newCw20Name: 'TEST',
						newCw20Symbol: 'TEST',
						bondingCurveCurveType: {
							curve_type: 0,
							data: {
								value: 0,
								scale: 0,
								slope: 0,
								power: 0,
							},
						},
						bondingCurveName: 'TEST',
						bondingCurveSymbol: 'TEST',
						bondingCurveDecimals: 18,
						bondingCurveReserveDenom: bondingCurveReserveDenom,
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
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				strategies: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				allowlistedBeneficiaries: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				allowlistedContributors: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				maturityWhitelist: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				maturityTime: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				profile: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				earningsFee: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				withdrawFee: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				depositFee: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				balanceFee: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				kycDonorsOnly: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				name: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				image: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				logo: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				categories: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				splitToLiquid: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
				ignoreUserSplits: {
					ownerControlled: true,
					govControlled: true,
					modifiableAfterInit: true,
					delegate: {
						Addr: ADDRESS_ZERO,
						expires: Math.floor(Date.now() / 1000) + 1000, // datetime int of delegation expiry
					},
				},
			},
			parent: ADDRESS_ZERO,
			maturityWhitelist: [],
			ignoreUserSplits: false,
			splitToLiquid: {
				max: 100,
				min: 0,
				defaultSplit: 50,
			},
		};

		if (endow_type === 0) {
			endowmentConfig.dao = {
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
						existingCw20Data: ADDRESS_ZERO,
						newCw20InitialSupply: '100000',
						newCw20Name: 'TEST',
						newCw20Symbol: 'TEST',
						bondingCurveCurveType: {
							curve_type: 0,
							data: {
								value: 0,
								scale: 0,
								slope: 0,
								power: 0,
							},
						},
						bondingCurveName: 'TEST',
						bondingCurveSymbol: 'TEST',
						bondingCurveDecimals: 18,
						bondingCurveReserveDenom: ADDRESS_ZERO,
						bondingCurveReserveDecimals: 18,
						bondingCurveUnbondingPeriod: 10,
					},
				},
			};
		}

		return endowmentConfig;
	} catch (error) {
		return Promise.reject(error);
	}
};

module.exports = {
	getCreateEndowmentConfig,
};
