// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from 'path'
import config from 'config'
import { saveFrontendFiles } from 'scripts/readWriteFile'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export async function deploySwapRouter(
	registrarContract: string,
	accountsContract: string,
	swapFactory: string,
	swapRouterAddress: string,
	verify_contracts: boolean,
	hre: HardhatRuntimeEnvironment
) {
	try {
		const {network,run,ethers} = hre;

		let [deployer, proxyAdmin] = await ethers.getSigners();
		const swapRouter = await ethers.getContractFactory('SwapRouter');
		const swapRouterInstance = await swapRouter.deploy();
		await swapRouterInstance.deployed();

		console.log('SwapRouter implementation address:', swapRouterInstance.address);
		// Deploy proxy contract

		const ProxyContract = await ethers.getContractFactory('ProxyContract');

		const SwapRouterData = {
			registrarContract,
			accountsContract,
			swapFactory,
			swapRouter: swapRouterAddress,
		};

		console.log("SwapRouterData", SwapRouterData);

		const swapRouterProxyData = swapRouterInstance.interface.encodeFunctionData('intiSwapRouter', [SwapRouterData]);

		const swapRouterProxy = await ProxyContract.deploy(swapRouterInstance.address, proxyAdmin.address, swapRouterProxyData);

		await swapRouterProxy.deployed();

		let swapRouterAddress2 = {
			swapRouterProxy: swapRouterProxy.address,
			swapRouterImplementation: swapRouterInstance.address,
		}

		if(verify_contracts){
			await run(`verify:verify`, {
				address: swapRouterInstance.address,
				constructorArguments: [],
			});
			await run(`verify:verify`, {
				address: swapRouterProxy.address,
				constructorArguments: [swapRouterInstance.address, proxyAdmin.address, swapRouterProxyData],
			});
		}

		await saveFrontendFiles({swapRouterAddress2});

		console.log('Swap Router Address (Proxy):', swapRouterProxy.address);

		return Promise.resolve(swapRouterProxy.address);
	} catch (error) {
		return Promise.reject(error);
	}
}
