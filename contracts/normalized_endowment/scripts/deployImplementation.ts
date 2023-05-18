// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { deployLockedWithdraw } from '../locked-withdraw/scripts/deploy'
import { saveFrontendFiles } from 'scripts/readWriteFile'
import { DonationMatchMessages } from "typechain-types/contracts/normalized_endowment/donation-match/DonationMatch.sol/DonationMatch";

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const HaloImplementations: Record<string, string | Record<string, string>> = {

}

const deployDonationMatch = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		const DonationMatch = await ethers.getContractFactory('DonationMatch');
		const donationMatchImplementation = await DonationMatch.deploy();
		await donationMatchImplementation.deployed();

		HaloImplementations.DonationMatchImplementation = donationMatchImplementation.address;

		if (verify_contracts) {
			await run('verify:verify', {
				address: donationMatchImplementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(donationMatchImplementation.address);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const deployCw900lvImplementation = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		const IncentivisedVotingLockup = await ethers.getContractFactory('IncentivisedVotingLockup');
		const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
		await IncentivisedVotingLockupImplementation.deployed();

		HaloImplementations.IncentivisedVotingLockupImplementation = IncentivisedVotingLockupImplementation.address;


		if (verify_contracts) {
			await run('verify:verify', {
				address: IncentivisedVotingLockupImplementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(IncentivisedVotingLockupImplementation.address);
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
};

const deployDonationMatchCharity = async (proxyAdmin: string, deployDonationMatchCharity: DonationMatchMessages.InstantiateMessageStruct, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		// Getting Proxy contract
		const ProxyContract = await ethers.getContractFactory('ProxyContract');

		const DonationMatch = await ethers.getContractFactory('DonationMatchCharity');
		const DonationMatchImplementation = await DonationMatch.deploy();
		await DonationMatchImplementation.deployed();

		// const DonationMatchEmitter = await ethers.getContractFactory('DonationMatchEmitter');
		// const DonationMatchEmitterImplementation = await DonationMatchEmitter.deploy();
		// await DonationMatchEmitterImplementation.deployed();

		const DonationMatchData = DonationMatchImplementation.interface.encodeFunctionData('initialize', [
			deployDonationMatchCharity,
		]);

		const DonationMatchProxy = await ProxyContract.deploy(
			DonationMatchImplementation.address,
			proxyAdmin,
			DonationMatchData
		);

		await DonationMatchProxy.deployed();

		console.log('DonationMatchCharityProxy Address (Proxy):', DonationMatchProxy.address);

		let DonationMatchAddress = {
			DonationMatchProxy: DonationMatchProxy.address,
			DonationMatchImplementation: DonationMatchImplementation.address,
		}

		if (verify_contracts) {
			await run('verify:verify', {
				address: DonationMatchImplementation.address,
				constructorArguments: [],
			});

			await run('verify:verify', {
				address: DonationMatchProxy.address,
				constructorArguments: [DonationMatchImplementation.address, proxyAdmin, DonationMatchData],
			});
		}

		HaloImplementations.DonationMatchAddress = DonationMatchAddress;

		return Promise.resolve(DonationMatchProxy.address);
	} catch (error) {
		return Promise.reject(error);
	}
};

const deploySubDao = async (ANGEL_CORE_STRUCT: string, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		const SubDaoLib = await ethers.getContractFactory('SubDaoLib');

		let SUB_DAO_LIB = await SubDaoLib.deploy();
		await SUB_DAO_LIB.deployed();

		const SubDao = await ethers.getContractFactory('SubDao', {
			libraries: {
				SubDaoLib: SUB_DAO_LIB.address,
			},
		});
		const SubDaoImplementation = await SubDao.deploy();
		await SubDaoImplementation.deployed();

		HaloImplementations.SubDaoImplementation = SubDaoImplementation.address;

		if (verify_contracts) {

			await run('verify:verify', {
				address: SUB_DAO_LIB.address,
				constructorArguments: [],
			});

			await run('verify:verify', {
				address: SubDaoImplementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(SubDaoImplementation.address);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const deploySubDaoERC20 = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		const subDaoERC20 = await ethers.getContractFactory('NewERC20');
		const subDaoERC20Implementation = await subDaoERC20.deploy();
		await subDaoERC20Implementation.deployed();

		HaloImplementations.subDaoERC20Implementation = subDaoERC20Implementation.address;

		if (verify_contracts) {
			await run('verify:verify', {
				address: subDaoERC20Implementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(subDaoERC20Implementation.address);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const deploySubDaoBondingve = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;

		const subDaoveToken = await ethers.getContractFactory('SubDaoToken');
		const subDaoveTokenImplementation = await subDaoveToken.deploy();
		await subDaoveTokenImplementation.deployed();

		HaloImplementations.subDaoveTokenImplementation = subDaoveTokenImplementation.address;

		if (verify_contracts) {
			await run('verify:verify', {
				address: subDaoveTokenImplementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(subDaoveTokenImplementation.address);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const deployFeeDistributor = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		// const FeeDistributor = await ethers.getContractFactory('FeeDistributorveToken');
		// const feeDistributorImplementation = await FeeDistributor.deploy();
		// await feeDistributorImplementation.deployed();

		return Promise.resolve(ADDRESS_ZERO);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

const deployIncentiisedVoting = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {
		const {network,run,ethers} = hre;
		const IncentivisedVotingLockup = await ethers.getContractFactory('IncentivisedVotingLockup');
		const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
		await IncentivisedVotingLockupImplementation.deployed();

		HaloImplementations.IncentivisedVotingLockupImplementation = IncentivisedVotingLockupImplementation.address;

		if(verify_contracts){
			await run('verify:verify', {
				address: IncentivisedVotingLockupImplementation.address,
				constructorArguments: [],
			});
		}

		return Promise.resolve(IncentivisedVotingLockupImplementation.address);
	} catch (e) {
		console.error(e);
		return Promise.reject(e);
	}
};

export async function deployImplementation(ANGEL_CORE_STRUCT: string, LockedWithdrawData: string[], donationMatchCharityData: DonationMatchMessages.InstantiateMessageStruct,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
	try {
		const {network,run,ethers} = hre;
		let [deployer, proxyAdmin] = await ethers.getSigners();
		const Implementation = {
			DonationMatch: await deployDonationMatch(verify_contracts, hre),
			DonationMatchCharity: await deployDonationMatchCharity(proxyAdmin.address, donationMatchCharityData,verify_contracts, hre),
			SubDao: await deploySubDao(ANGEL_CORE_STRUCT,verify_contracts, hre),
			SubDaoERC20: await deploySubDaoERC20(verify_contracts, hre),
			SubDaoBondingve: await deploySubDaoBondingve(verify_contracts,hre),
			FeeDistributor: await deployFeeDistributor(verify_contracts,hre),
			IncentiisedVoting: await deployIncentiisedVoting(verify_contracts,hre),
			LockedWithdraw: await deployLockedWithdraw(proxyAdmin.address, LockedWithdrawData,verify_contracts,hre),
			cw900lv: await deployCw900lvImplementation(verify_contracts,hre),
		};

		await saveFrontendFiles({HaloImplementations});

		return Promise.resolve(Implementation);
	} catch (error) {
		return Promise.reject(error);
	}
}
