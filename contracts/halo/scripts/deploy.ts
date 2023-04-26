// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from 'path'
// const hre = require('hardhat');
import { deployGov } from '../gov/scripts/deploy'
import { GovHodler } from '../gov-hodler/scripts/deploy'
import { Airdrop } from '../airdrop/scripts/deploy'
import { Community } from '../community/scripts/deploy'
import { distributor } from '../distributor/scripts/deploy'
import { Vesting } from '../vesting/scripts/deploy'
import { Staking } from '../staking/scripts/deploy'
import { Collector } from '../collector/scripts/deploy'
// const ethers = hre.ethers;
import config from '../../../config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const deployERC20 = async (proxyAdmin: string, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
	try {

		const { ethers, run, network } = hre;
		const ERC20Upgrade = await ethers.getContractFactory('ERC20Upgrade');
		const ERC20UpgradeInstance = await ERC20Upgrade.deploy();
		await ERC20UpgradeInstance.deployed();

		console.log('ERC20Upgrade implementation address:', ERC20UpgradeInstance.address);

		const ProxyContract = await ethers.getContractFactory('ProxyContract');

		const ERC20UpgradeData = ERC20UpgradeInstance.interface.encodeFunctionData('initialize');

		const ERC20UpgradeProxy = await ProxyContract.deploy(ERC20UpgradeInstance.address, proxyAdmin, ERC20UpgradeData);

		await ERC20UpgradeProxy.deployed();

		if (verify_contracts) {
			await hre.run('verify:verify', {
				address: ERC20UpgradeInstance.address,
				constructorArguments: [],
			});
			await hre.run('verify:verify', {
				address: ERC20UpgradeProxy.address,
				constructorArguments: [ERC20UpgradeInstance.address, proxyAdmin, ERC20UpgradeData],
			});
		}
		console.log('ERC20Upgrade Address (Proxy):', ERC20UpgradeProxy.address);

		return Promise.resolve(ERC20UpgradeProxy.address);
	} catch (error) {
		return Promise.reject(error);
	}
};

export async function deployHaloImplementation(
	swapRouter: string,
	verify_contracts: boolean,
	hre: HardhatRuntimeEnvironment
) {
	try {

		const {
			curTimelock,
			GovHodlerOwner,
			airdropOwner,
			CommunitySpendLimit,
			distributorWhitelist,
			distributorSpendLimit,
		} = config.HALO_IMPLEMENTATION_DATA;

		const { ethers, run, network } = hre;

		let [deployer, proxyAdmin] = await ethers.getSigners();

		let halo = await deployERC20(proxyAdmin.address,verify_contracts,hre);

		let gov = await deployGov(proxyAdmin.address, halo, curTimelock, verify_contracts,hre);

		let halo_code = await ethers.getContractAt('ERC20Upgrade', halo);

		if (!config.PROD) {
			await halo_code.mint(deployer.address, ethers.utils.parseEther('100000000000000000000000000'));
		}

		await halo_code.transferOwnership(gov.GovProxy); // TODO: uncomment this before deploying to prod. Keep this commented while testing

		const distributorAddress = await distributor(proxyAdmin.address, {
			timelockContract: gov.TimeLock,
			haloToken: halo,
			whitelist: [...distributorWhitelist],
			spendLimit: distributorSpendLimit,
		}, hre);
		var response = {
			Halo: halo,
			Gov: gov,
			GovHodler: await GovHodler(proxyAdmin.address, {
				owner: GovHodlerOwner,
				haloToken: halo,
				timelockContract: gov.TimeLock,
			},hre),
			Airdrop: await Airdrop(proxyAdmin.address, {
				owner: airdropOwner,
				haloToken: halo,
			}, hre),
			Community: await Community(proxyAdmin.address, {
				timelockContract: gov.TimeLock,
				haloToken: halo,
				spendLimit: CommunitySpendLimit,
			}, hre),
			distributor: distributorAddress,
			vesting: await Vesting(proxyAdmin.address, {
				haloToken: halo,
			}, hre),
			collector: await Collector(proxyAdmin.address, {
				timelockContract: gov.TimeLock,
				govContract: gov.GovProxy,
				swapFactory: swapRouter,
				haloToken: halo,
				distributorContract: distributorAddress,
				rewardFactor: 90,
			}, hre),
			staking: await Staking(proxyAdmin.address, {
				haloToken: halo,
				interestRate: 10,
			}, hre),
		};

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
}

