// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { deployDiamond } from 'contracts/core/accounts/scripts/deploy'
import { deployRegistrar } from 'contracts/core/registrar/scripts/deploy'
import { deployImplementation } from 'contracts/normalized_endowment/scripts/deployImplementation'
import { deployMultisig } from 'contracts/multisigs/scripts/deploy'
import { deploySwapRouter } from 'contracts/core/swap-router/scripts/deploy'
import { deployIndexFund } from 'contracts/core/index-fund/scripts/deploy'
import { deployEndowmentMultiSig } from 'contracts/normalized_endowment/endowment-multisig/scripts/deploy'
import { deployHaloImplementation } from 'contracts/halo/scripts/deploy'
import { charityApplications } from 'contracts/multisigs/charity_applications/scripts/deploy'

import config from 'config'
import { deployEmitters } from 'contracts/normalized_endowment/scripts/deployEmitter'
// import { giftCard } from 'contracts/accessory/gift-cards/scripts/deploy'
// import { deployFundraising } from 'contracts/accessory/fundraising/scripts/deploy'

var ANGEL_CORE_STRUCT: Contract;
var STRING_LIBRARY: Contract;
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
var REGISTRAR_ADDRESS;
var deployer;
var proxyAdmin;

let updateConfig;

interface AddressWriter { [key: string]: string | AddressWriter }
let addressWriter: AddressWriter = {}; 

import { saveFrontendFiles, cleanFile } from './readWriteFile'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Contract } from 'ethers'
import { APTeamMultiSig, ApplicationsMultiSig } from 'typechain-types'

async function deployLibraries(verify_contracts: boolean,hre: HardhatRuntimeEnvironment) {
	try {
		await cleanFile();

		const { ethers, run, network } = hre;

		const angel_core_struct = await ethers.getContractFactory('AngelCoreStruct');
		ANGEL_CORE_STRUCT = await angel_core_struct.deploy();
		await ANGEL_CORE_STRUCT.deployed();

		const string_library = await ethers.getContractFactory('StringArray');
		STRING_LIBRARY = await string_library.deploy();
		await STRING_LIBRARY.deployed();

		console.log('Libraries Deployed as', {
			'STRING_LIBRARY Deployed at ': STRING_LIBRARY.address,
			'ANGEL_CORE_STRUCT_LIBRARY Deployed at ': ANGEL_CORE_STRUCT.address,
		});

		let libraries = {
			"STRING_LIBRARY" : STRING_LIBRARY.address,
			"ANGEL_CORE_STRUCT_LIBRARY" : ANGEL_CORE_STRUCT.address
		}

		await saveFrontendFiles({libraries});

		if(network.name !== 'hardhat' && verify_contracts){
			await run(`verify:verify`, {
				address: ANGEL_CORE_STRUCT.address,
				constructorArguments: [],
			});
			await run(`verify:verify`, {
				address: STRING_LIBRARY.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(true);
	} catch (e) {
		console.error('Failed deploying libraries:-', e);
		return Promise.reject(false);
	}
}

export async function mainTask(apTeamAdmins = [], verify_contracts = false, hre: HardhatRuntimeEnvironment) {
	try {
		const { run, network, ethers } = hre;


		var Admins = config.AP_TEAM_MULTISIG_DATA.admins;
		if (apTeamAdmins.length != 0) Admins = apTeamAdmins;

		[deployer, proxyAdmin] = await ethers.getSigners();
		console.log('Deploying the contracts with the account:', await deployer.getAddress());

		// Mock setup required for testing
		let mockUSDC: Contract | undefined;
		if (network.name === 'hardhat') {
			const MockUSDC = await ethers.getContractFactory('MockUSDC');
			mockUSDC = await MockUSDC.deploy('USDC', 'USDC', 100);
			await mockUSDC.deployed();
			config.REGISTRAR_DATA.acceptedTokens.cw20 = [mockUSDC.address];
			config.REGISTRAR_UPDATE_CONFIG.usdcAddress = mockUSDC.address;
			config.DONATION_MATCH_CHARITY_DATA.usdcAddress = mockUSDC.address;

			let tx = await mockUSDC.mint(deployer.address, ethers.utils.parseEther('10000000000000000000000'));
			await tx.wait();

			console.log('given deployer USDC');

			console.log('USDC Mock Address', mockUSDC.address);
		}

		await deployLibraries(verify_contracts,hre);

		const registrarData = {
			treasury: config.REGISTRAR_DATA.treasury,
			splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
			router: config.REGISTRAR_DATA.router,
			axelarGateway: config.REGISTRAR_DATA.axelarGateway,
			axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv
		};

		REGISTRAR_ADDRESS = await deployRegistrar(STRING_LIBRARY.address, registrarData, verify_contracts, hre);

		var APTeamData: Parameters<APTeamMultiSig["initialize"]> = [Admins, config.AP_TEAM_MULTISIG_DATA.threshold, config.AP_TEAM_MULTISIG_DATA.requireExecution];
		var ApplicationData: Parameters<ApplicationsMultiSig["initialize"]> = [
			Admins,
			config.APPLICATION_MULTISIG_DATA.threshold,
			config.APPLICATION_MULTISIG_DATA.requireExecution,
		];
		console.log(APTeamData, ApplicationData);
		const multisigAddress = await deployMultisig(ApplicationData ,APTeamData, verify_contracts, hre);

		const ACCOUNT_ADDRESS = await deployDiamond(
			multisigAddress.APTeamMultiSig,
			REGISTRAR_ADDRESS,
			ANGEL_CORE_STRUCT.address,
			STRING_LIBRARY.address,
			hre,
			verify_contracts
		);

		addressWriter.accountDiamond = ACCOUNT_ADDRESS;

		console.log('Account contract deployed at:-', ACCOUNT_ADDRESS);

		let emitters = await deployEmitters(ACCOUNT_ADDRESS, verify_contracts, hre);

		console.log('emitters Contract deployed at:-', emitters);

		let charityApplicationsData: Parameters<typeof charityApplications>[0] = [
			config.CHARITY_APPLICATION_DATA.expiry,
			multisigAddress.ApplicationsMultiSig,
			ACCOUNT_ADDRESS,
			config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
			config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
			config.CHARITY_APPLICATION_DATA.gasAmount,
			config.CHARITY_APPLICATION_DATA.fundSeedAsset,
			config.CHARITY_APPLICATION_DATA.seedAsset,
			config.CHARITY_APPLICATION_DATA.seedAssetAmount,
		];

		let charityApplicationsAddress = await charityApplications(charityApplicationsData, verify_contracts, hre);
		console.log('charityApplicationsAddress deployed at:-', charityApplicationsAddress);

		const SWAP_ROUTER = await deploySwapRouter(
			REGISTRAR_ADDRESS,
			ACCOUNT_ADDRESS,
			config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
			config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
			verify_contracts,
			hre
		);

		console.log('SWAP_ROUTER contract deployed at:-', SWAP_ROUTER);

		const indexFundData = {
			registrarContract: REGISTRAR_ADDRESS,
			fundRotation: config.INDEX_FUND_DATA.fundRotation,
			fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
			fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
		};

		let INDEX_FUND_ADDRESS = await deployIndexFund(indexFundData, verify_contracts, hre);

		console.log('INDEX_FUND_ADDRESS contract deployed at:-', INDEX_FUND_ADDRESS);

		let multisigDat = await deployEndowmentMultiSig(verify_contracts, hre);

		console.log('multisigDat contract deployed at:-', multisigDat);

		const lockedWithdrawalData = [
			REGISTRAR_ADDRESS,
			ACCOUNT_ADDRESS,
			multisigAddress.APTeamMultiSig,
			multisigDat.MultiSigWalletFactory,
		];

		// console.log('implementations deployed at:', implementations);

		// let GiftCardDataInput = {
		// 	keeper: multisigAddress.APTeamMultiSig,
		// 	registrarContract: REGISTRAR_ADDRESS,
		// };

		// let giftCardAddress = await giftCard(GiftCardDataInput, ANGEL_CORE_STRUCT.address, verify_contracts, hre);

		// let FundraisingDataInput = {
		// 	registrarContract: REGISTRAR_ADDRESS,
		// 	nextId: config.FundraisingDataInput.nextId,
		// 	campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
		// 	taxRate: config.FundraisingDataInput.taxRate,
		// 	acceptedTokens: config.FundraisingDataInput.acceptedTokens,
		// };
		// let fundraisingAddress = await deployFundraising(FundraisingDataInput, ANGEL_CORE_STRUCT.address, verify_contracts, hre);

		var haloAddress = await deployHaloImplementation(
			SWAP_ROUTER,
			verify_contracts, 
			hre
		);

		addressWriter.haloAddress = haloAddress;

		const haloToken = await ethers.getContractAt('ERC20', haloAddress.Halo);

		console.log('halo token deployed at: ', haloToken.address);

		console.log('halo token balance: ', await haloToken.balanceOf(deployer.address));

		// 
		if (network.name === 'hardhat') {
			// if network is 'hardhat' then mockUSDC should always be initialized
			// but TS forces us to confirm this is the case
			mockUSDC = mockUSDC!

			let UniswapUtils = await ethers.getContractFactory('UniswapUtils');
			let uniswap_utils = await UniswapUtils.deploy();
			await uniswap_utils.deployed();

			// create a uniswap pool for HALO and USDC
			console.log('halo', haloToken.address.toString());
			console.log('usdc', mockUSDC.address.toString());
			let sqrtPrice = '79228162514264334008320';
			if (mockUSDC.address < haloToken.address.toString()) {
				sqrtPrice = '79228162514264337593543950336000000';
			}
			const createUniswapPoolParams = {
				projectToken: haloToken.address,
				usdcToken: mockUSDC.address,
				uniswapFee: 3000,
				amountA: ethers.utils.parseEther('100000000'),
				amountB: ethers.utils.parseUnits('100000000', 6),
				sqrtPriceX96: sqrtPrice,
				tickLower: '-598680',
				tickUpper: '506580',
			};
			haloToken.approve(uniswap_utils.address, ethers.utils.parseEther('100000000'));
			mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits('100000000', 6));
			await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams);

			console.log('Created HALO pool');

			// create a uniswap pool for WETH and USDC
			console.log('WETH address: ', config.REGISTRAR_UPDATE_CONFIG.wethAddress);
			console.log('USDC address: ', mockUSDC.address.toString());

			sqrtPrice = '79228162514264334008320';
			if (mockUSDC.address < config.REGISTRAR_UPDATE_CONFIG.wethAddress) {
				sqrtPrice = '79228162514264337593543950336000000';
			}
			const createUniswapPoolParams2 = {
				tokenA: mockUSDC.address,
				tokenB: config.REGISTRAR_UPDATE_CONFIG.wethAddress,
				uniswapFee: 3000,
				amountA: ethers.utils.parseUnits('1000', 6),
				sqrtPriceX96: sqrtPrice,
				tickLower: '-598680',
				tickUpper: '506580',
			};
			mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits('1000', 6));
			await uniswap_utils.createPoolAndMintPosition(createUniswapPoolParams2, {
				value: ethers.utils.parseEther('1000'),
			});

			console.log('Created WETH pool');

			// deploy DAI
			const DAI = await ethers.getContractFactory('MockERC20');
			const dai = await DAI.deploy('DAI', 'DAI', '1000000000');
			await dai.deployed();
			config.REGISTRAR_UPDATE_CONFIG.DAI_address = dai.address;
			config.DONATION_MATCH_CHARITY_DATA.DAI_address = dai.address;
			config.REGISTRAR_DATA.acceptedTokens.cw20.push(dai.address);

			// mint DAI
			await dai.mint(deployer.address, ethers.utils.parseEther('100000000'));

			console.log(dai.address);

			// create a uniswap pool for DAI and USDC
			sqrtPrice = '79228162514264334008320';
			if (mockUSDC.address < dai.address.toString()) {
				sqrtPrice = '79228162514264337593543950336000000';
			}
			const createUniswapPoolParams3 = {
				projectToken: dai.address,
				usdcToken: mockUSDC.address,
				uniswapFee: 3000,
				amountA: ethers.utils.parseEther('100000000'),
				amountB: ethers.utils.parseUnits('100000000', 6),
				sqrtPriceX96: sqrtPrice,
				tickLower: '-598680',
				tickUpper: '506580',
			};
			dai.approve(uniswap_utils.address, ethers.utils.parseEther('100000000'));
			mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits('100000000', 6));
			await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams3);
			console.log('Created DAI pool');
		}

		//  requires setting up of a HALO - MockUSDC pool on forked uniswap in deployment
		// if PROD flag is false

		let donationMatchCharityData = {
			reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
			uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
			registrarContract: REGISTRAR_ADDRESS,
			poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
			usdcAddress: config.DONATION_MATCH_CHARITY_DATA.usdcAddress,
		};

		if (network.name === 'hardhat') {
			// haloToken
			donationMatchCharityData.reserveToken = haloToken.address;
			donationMatchCharityData.uniswapFactory = config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS;
			donationMatchCharityData.poolFee = 3000;
			donationMatchCharityData.usdcAddress = mockUSDC!.address;
		}

		// transfer 100000000 HALO to donation match charities

		let implementations = await deployImplementation(
			ANGEL_CORE_STRUCT.address,
			lockedWithdrawalData,
			donationMatchCharityData,
			verify_contracts,
			hre
		);

		if (network.name === 'hardhat') {
			await haloToken.transfer(implementations.DonationMatchCharity, ethers.utils.parseEther('100000000'));
		}

		config.REGISTRAR_DATA.acceptedTokens.cw20.push(haloToken.address);

		updateConfig = {
			accountsContract: ACCOUNT_ADDRESS, //Address
			approved_charities: [], //string[]
			splitMax: 100, //uint256
			splitMin: 0, //uint256
			splitDefault: 50, //uint256
			collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
			subdaoGovContract: implementations.SubDao, //address
			subdaoCw20TokenContract: implementations.SubDaoERC20, //address
			subdaoBondingTokenContract: implementations.SubDaoBondingve, //address
			subdaoCw900Contract: implementations.IncentiisedVoting, //address
			subdaoDistributorContract: ADDRESS_ZERO,
			subdaoEmitter: emitters.subDaoEmitter, //TODO:
			donationMatchContract: implementations.DonationMatch, //address
			indexFundContract: INDEX_FUND_ADDRESS, //address
			govContract: haloAddress.Gov.GovProxy, //address
			treasury: config.REGISTRAR_DATA.treasury,
			donationMatchCharitesContract: implementations.DonationMatchCharity, // once uniswap is setup //address
			donationMatchEmitter: emitters.DonationMatchEmitter,
			haloToken: haloAddress.Halo, //address
			haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract, //address
			charitySharesContract: ADDRESS_ZERO, //TODO: //address
			fundraisingContract: ADDRESS_ZERO, //TODO: //address
			applicationsReview: multisigAddress.ApplicationsMultiSig, //address
			swapsRouter: SWAP_ROUTER, //address
			multisigFactory: multisigDat.MultiSigWalletFactory, //address
			multisigEmitter: multisigDat.EndowmentMultiSigEmitter, //address
			charityProposal: charityApplicationsAddress, //address
			lockedWithdrawal: implementations.LockedWithdraw, //address
			proxyAdmin: proxyAdmin.address, //address
			usdcAddress: config.REGISTRAR_UPDATE_CONFIG.usdcAddress, //address
			wethAddress: config.REGISTRAR_UPDATE_CONFIG.wethAddress,
			cw900lvAddress: implementations.cw900lv,
		};

		let REGISTRAR_CONTRACT = await ethers.getContractAt('Registrar', REGISTRAR_ADDRESS);

		let data = await REGISTRAR_CONTRACT.updateConfig(updateConfig);
		console.log('Successfully updated config:-', data.hash);

		let newOwner = await REGISTRAR_CONTRACT.transferOwnership(multisigAddress.APTeamMultiSig);
		console.log('Successfully transferred Ownership:-', newOwner.hash);

		let INDEX_FUND_CONTRACT = await ethers.getContractAt('IndexFund', INDEX_FUND_ADDRESS);

		let new_owner_index = await INDEX_FUND_CONTRACT.updateOwner(multisigAddress.APTeamMultiSig);
		console.log('Successfully transferred Ownership:-', new_owner_index.hash);

		var composedAddress = {
			libraries: {
				stringLibrary: STRING_LIBRARY.address,
				AngelCoreStruct: ANGEL_CORE_STRUCT.address,
			},
			dai: config.REGISTRAR_UPDATE_CONFIG.DAI_address,
			registrar: REGISTRAR_ADDRESS,
			account: ACCOUNT_ADDRESS,
			multisigAddress,
			charityApplicationsAddress,
			swapRouter: SWAP_ROUTER,
			indexFund: INDEX_FUND_ADDRESS,
			multisigDat,
			implementations,
			haloAddress,
			// giftCardAddress,
			// fundraisingAddress,
			haloGovContract: haloAddress.Gov.GovProxy,
			timelockContract: haloAddress.Gov.TimeLock,
			votingERC20: haloAddress.Gov.VotingERC20Proxy,
			lockedWithdraw: implementations.LockedWithdraw,
		};

		await saveFrontendFiles({addressWriter});
		await saveFrontendFiles({composedAddress});
		return {
			addresses: composedAddress,
			registrarConfig: updateConfig,
		};
	} catch (e) {
		console.error('Failed deploying Contracts:-', e);
		return Promise.reject(false);
	}
}
