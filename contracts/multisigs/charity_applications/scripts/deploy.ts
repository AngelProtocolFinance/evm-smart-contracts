// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { BigNumberish } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { CharityApplication__factory } from "../../../../typechain-types"
import { PromiseOrValue } from '../../../../typechain-types/common'
import { saveFrontendFiles } from './../../../../scripts/readWriteFile'

type InitializeParamsType = [
    PromiseOrValue<BigNumberish>,
    PromiseOrValue<string>,
    PromiseOrValue<string>,
    PromiseOrValue<BigNumberish>,
    PromiseOrValue<boolean>,
    PromiseOrValue<BigNumberish>,
    PromiseOrValue<boolean>,
    PromiseOrValue<string>,
    PromiseOrValue<BigNumberish>
  ]

export async function charityApplications(CharityApplicationDataInput: InitializeParamsType, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
    try {
        const {run,ethers} = hre;

        let [_deployer, proxyAdmin] = await ethers.getSigners();
        const CharityApplicationLib = await ethers.getContractFactory('CharityApplicationLib');
        const CharityApplicationLibInstance = await CharityApplicationLib.deploy();
        await CharityApplicationLibInstance.deployed();

        const CharityApplication = await ethers.getContractFactory('CharityApplication',
                {
                    libraries: {
                        CharityApplicationLib: CharityApplicationLibInstance.address
                    }
                }
            ) as CharityApplication__factory;
        const CharityApplicationInstance = await CharityApplication.deploy();
        await CharityApplicationInstance.deployed();
    
        console.log('CharityApplication implementation address:', CharityApplicationInstance.address);

        const ProxyContract = await ethers.getContractFactory('ProxyContract');

        const CharityApplicationData = CharityApplicationInstance.interface.encodeFunctionData('initialize', [...CharityApplicationDataInput]);
    
        const CharityApplicationProxy = await ProxyContract.deploy(CharityApplicationInstance.address, proxyAdmin.address, CharityApplicationData);
    
        await CharityApplicationProxy.deployed();
    
        console.log('CharityApplication Address (Proxy):', CharityApplicationProxy.address);
  
        if(verify_contracts){
            await run(`verify:verify`, {
                address: CharityApplicationInstance.address,
                constructorArguments: [],
            });
            await run(`verify:verify`, {
                address: CharityApplicationProxy.address,
                constructorArguments: [CharityApplicationInstance.address, proxyAdmin.address, CharityApplicationData],
            });
        }

        let charityApplication = {
            CharityApplicationProxy: CharityApplicationProxy.address,
            CharityApplicationImplementation: CharityApplicationInstance.address
        }

        await saveFrontendFiles({charityApplication});
        
        return Promise.resolve(CharityApplicationProxy.address);
    } catch (error) {
        return Promise.reject(error)
    }
}
