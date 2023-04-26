// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { saveFrontendFiles } from '../../../../scripts/readWriteFile'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

let EndowmentMultiSigAddress: Record<string, string> = {}

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

    EndowmentMultiSigAddress.EndowmentMultiSigEmitterProxy = EndowmentMultiSigEmitterProxy.address;
    EndowmentMultiSigAddress.EndowmentMultiSigEmitterImplementation = EndowmentMultiSigEmitterImplementation.address;

    return Promise.resolve(EndowmentMultiSigEmitterProxy.address);
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



    let response = {
      MultiSigWalletFactory: MultiSigWalletFactoryInstance.address,
      EndowmentMultiSigEmitter: await deployEndowmentMultiSigEmitter(proxyAdmin.address, MultiSigWalletFactoryInstance.address, verify_contracts, hre)
    }

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

    EndowmentMultiSigAddress.MultiSigWalletFactory = MultiSigWalletFactoryInstance.address;
    EndowmentMultiSigAddress.MultiSigWalletImplementation = EndowmentMultiSigInstance.address;

    await saveFrontendFiles({EndowmentMultiSigAddress});

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
