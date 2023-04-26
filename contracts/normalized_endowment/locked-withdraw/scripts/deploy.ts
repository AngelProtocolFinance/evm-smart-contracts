// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from 'path'
import { saveFrontendFiles } from './../../../../scripts/readWriteFile'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const deployLockedWithdraw = async (proxyAdmin: string,LockedWithdrawDataInput: string[], verify_contracts: boolean,hre: HardhatRuntimeEnvironment) => {
  try {
    const {network,run,ethers} = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory('ProxyContract');

    const LockedWithdraw = await ethers.getContractFactory('LockedWithdraw');
    const LockedWithdrawImplementation = await LockedWithdraw.deploy();
    await LockedWithdrawImplementation.deployed();
    console.log('LockedWithdrawImplementation Address:', LockedWithdrawImplementation.address);

    const LockedWithdrawData = LockedWithdrawImplementation.interface.encodeFunctionData('initialize', [...LockedWithdrawDataInput]);
    const LockedWithdrawProxy = await ProxyContract.deploy(LockedWithdrawImplementation.address, proxyAdmin, LockedWithdrawData);
    await LockedWithdrawProxy.deployed();
    console.log('LockedWithdrawProxy Address (Proxy):', LockedWithdrawProxy.address);
    
    if (verify_contracts) {
			await hre.run('verify:verify', {
				address: LockedWithdrawImplementation.address,
				constructorArguments: [],
			});
			await hre.run('verify:verify', {
				address: LockedWithdrawProxy.address,
				constructorArguments: [...LockedWithdrawDataInput],
			});
		}

    let lockedWithdraw = {
      LockedWithdrawImplementation: LockedWithdrawImplementation.address,
      LockedWithdrawProxy: LockedWithdrawProxy.address
    }
    await saveFrontendFiles({lockedWithdraw})
		
    return Promise.resolve(LockedWithdrawProxy.address);
  }
  catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}