// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { logger, updateAddresses } from "utils"

const deployEndowmentMultiSigEmitter = async(proxyAdmin: string,factoryAddress: string,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) =>{
  try {
    // Getting Proxy contract
    const {ethers,run,network} = hre;
    const ProxyContract = await ethers.getContractFactory('ProxyContract');

    const EndowmentMultiSigEmitter = await ethers.getContractFactory('EndowmentMultiSigEmitter');
    const EndowmentMultiSigEmitterImplementation = await EndowmentMultiSigEmitter.deploy();
    await EndowmentMultiSigEmitterImplementation.deployed();

    const EndowmentMultiSigEmitterData = EndowmentMultiSigEmitterImplementation.interface.encodeFunctionData('initEndowmentMultiSigEmitter', [factoryAddress]);

    const EndowmentMultiSigEmitterProxy = await ProxyContract.deploy(EndowmentMultiSigEmitterImplementation.address, proxyAdmin, EndowmentMultiSigEmitterData);

    await EndowmentMultiSigEmitterProxy.deployed();

    console.log('EndowmentMultiSigEmitterProxy Address (Proxy):', EndowmentMultiSigEmitterProxy.address);

    if(verify_contracts){
      await run("verify:verify", {
        address: EndowmentMultiSigEmitterImplementation.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: EndowmentMultiSigEmitterProxy.address,
        constructorArguments: [EndowmentMultiSigEmitterImplementation.address,proxyAdmin,EndowmentMultiSigEmitterData],
      });
    }

    return Promise.resolve({
      EndowmentMultiSigEmitterProxy: EndowmentMultiSigEmitterProxy.address,
      EndowmentMultiSigEmitterImplementation: EndowmentMultiSigEmitterImplementation.address,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}


export async function deployEndowmentMultiSig(verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
  try {

    const {ethers,run,network} = hre;
    const [deployer, proxyAdmin] = await ethers.getSigners();
    const EndowmentMultiSig = await ethers.getContractFactory('EndowmentMultiSig',);
    const EndowmentMultiSigInstance = await EndowmentMultiSig.deploy();
    await EndowmentMultiSigInstance.deployed();

    console.log('EndowmentMultiSig implementation address:', EndowmentMultiSigInstance.address);

    const MultiSigWalletFactory = await ethers.getContractFactory('MultiSigWalletFactory',);
    const MultiSigWalletFactoryInstance = await MultiSigWalletFactory.deploy(EndowmentMultiSigInstance.address, proxyAdmin.address);
    await MultiSigWalletFactoryInstance.deployed();

    console.log('MultiSigWalletFactory address:', MultiSigWalletFactoryInstance.address);

    const EndowmentMultiSigEmitterAddresses = await deployEndowmentMultiSigEmitter(proxyAdmin.address, MultiSigWalletFactoryInstance.address, verify_contracts, hre)

    let response = {
      MultiSigWalletFactory: MultiSigWalletFactoryInstance.address,
      EndowmentMultiSigEmitter: EndowmentMultiSigEmitterAddresses.EndowmentMultiSigEmitterProxy
    }

    logger.out("Saving addresses to contract-address.json...")
		await updateAddresses(
			{
				EndowmentMultiSigAddress: {
          ...EndowmentMultiSigEmitterAddresses,
          MultiSigWalletFactory: MultiSigWalletFactoryInstance.address,
          MultiSigWalletImplementation: EndowmentMultiSigInstance.address
        }
			},
			hre
		);

    if(verify_contracts){
      await run("verify:verify", {
        address: EndowmentMultiSigInstance.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: MultiSigWalletFactoryInstance.address,
        constructorArguments: [EndowmentMultiSigInstance.address,proxyAdmin.address],
      });
    }

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
