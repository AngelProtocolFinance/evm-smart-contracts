// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { updateAddresses } from "utils"
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { RegistrarMessages } from "typechain-types/contracts/core/registrar/registrar.sol/Registrar"

export async function deployRegistrar(STRING_LIBRARY: string,registrarData: RegistrarMessages.InstantiateRequestStruct,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
	try {

		const {network,run,ethers} = hre;

		let [deployer, proxyAdmin] = await ethers.getSigners();

		// const [deployer] = await ethers.getSigners();
		// Deploy registrar implementation first

		// const registrarLib = await ethers.getContractFactory('RegistrarLib');
		// const registrarLibInstance = await registrarLib.deploy();
		// await registrarLibInstance.deployed();

		const Registrar = await ethers.getContractFactory('Registrar')
		const registrarImplementation = await Registrar.deploy();
		await registrarImplementation.deployed();

		console.log('registrarImplementation implementation address:', registrarImplementation.address);
		// Deploy proxy contract

		const ProxyContract = await ethers.getContractFactory('ProxyContract');

		// Initialise registrar

		const registrarProxyData = registrarImplementation.interface.encodeFunctionData(
			"initialize((address,(uint256,uint256,uint256),address,address,address))", 
			[registrarData]
		);

		const registrarProxy = await ProxyContract.deploy(registrarImplementation.address, proxyAdmin.address, registrarProxyData);

		await registrarProxy.deployed();

		if(verify_contracts){
			await run(`verify:verify`, {
				address: registrarImplementation.address,
				constructorArguments: [],
			});
			await run(`verify:verify`, {
				address: registrarProxy.address,
				constructorArguments: [registrarImplementation.address, proxyAdmin.address, registrarProxyData],
			});
		}

		await updateAddresses(
			{
				registrar: {
					implementation: registrarImplementation.address,
					proxy: registrarProxy.address
				}
			},
			hre
		);

		console.log('Registrar Address (Proxy):', registrarProxy.address);

		return Promise.resolve(registrarProxy.address);
	} catch (error) {
		return Promise.reject(error);
	}
}
