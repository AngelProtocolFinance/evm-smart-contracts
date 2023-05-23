// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from 'path'
import { charityApplications } from '../charity_applications/scripts/deploy'
import config from 'config'
import { saveFrontendFiles } from "utils"
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ApplicationsMultiSig, APTeamMultiSig } from 'typechain-types'
// import { IndexFundMessage } from "typechain-types/contracts/core/index-fund/IndexFund"

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export async function deployMultisig(ApplicationMultisigData: Parameters<ApplicationsMultiSig["initialize"]>, APTeamMultisigData: Parameters<APTeamMultiSig["initialize"]>, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
  try {
    const {network,run,ethers} = hre;

    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory('ProxyContract');

    let [deployer, proxyAdmin] = await ethers.getSigners();

    const ApplicationsMultiSig = await ethers.getContractFactory('ApplicationsMultiSig');
    const ApplicationsMultiSigInstance = await ApplicationsMultiSig.deploy();
    await ApplicationsMultiSigInstance.deployed();

    console.log('ApplicationsMultiSig implementation address:', ApplicationsMultiSigInstance.address);

    const APTeamMultiSig = await ethers.getContractFactory('APTeamMultiSig');
    const APTeamMultiSigInstance = await APTeamMultiSig.deploy();
    await APTeamMultiSigInstance.deployed();

    console.log('APTeamMultiSig implementation address:', APTeamMultiSigInstance.address);

    const ApplicationsMultiSigData = ApplicationsMultiSigInstance.interface.encodeFunctionData('initialize', [...ApplicationMultisigData]);

    const ApplicationsMultiSigProxy = await ProxyContract.deploy(ApplicationsMultiSigInstance.address, proxyAdmin.address, ApplicationsMultiSigData);

    await ApplicationsMultiSigProxy.deployed();

    console.log('ApplicationsMultiSig Address (Proxy):', ApplicationsMultiSigProxy.address);

    const APTeamMultiSigData = APTeamMultiSigInstance.interface.encodeFunctionData('initialize', [...APTeamMultisigData]);

    const APTeamMultiSigProxy = await ProxyContract.deploy(APTeamMultiSigInstance.address, proxyAdmin.address, APTeamMultiSigData);

    await APTeamMultiSigProxy.deployed();

    if(verify_contracts){
      await run(`verify:verify`, {
        address: ApplicationsMultiSigInstance.address,
        contract: 'contracts/multisigs/ApplicationsMultiSig.sol:ApplicationsMultiSig',
        constructorArguments: [],
      });
      await run(`verify:verify`, {
        address: ApplicationsMultiSigProxy.address,
        constructorArguments: [ApplicationsMultiSigInstance.address, proxyAdmin.address, ApplicationsMultiSigData],
      });
      await run(`verify:verify`, {
        address: APTeamMultiSigInstance.address,
        contract: 'contracts/multisigs/APTeamMultiSig.sol:APTeamMultiSig',
        constructorArguments: [],
      });
      await run(`verify:verify`, {
        address: APTeamMultiSigProxy.address,
        constructorArguments: [APTeamMultiSigInstance.address, proxyAdmin.address, APTeamMultiSigData],
      });
    }

    let multiSig = {
      ApplicationsMultiSigProxy: ApplicationsMultiSigProxy.address,
      APTeamMultiSigProxy: APTeamMultiSigProxy.address,
      ApplicationMultisigImplementation: ApplicationsMultiSigInstance.address,
      APTeamMultisigImplementation: APTeamMultiSigInstance.address
    };

    await saveFrontendFiles({multiSig});
    
    console.log('APTeamMultiSig Address (Proxy):', APTeamMultiSigProxy.address);

    let response = {
      APTeamMultiSig: APTeamMultiSigProxy.address,
      ApplicationsMultiSig: ApplicationsMultiSigProxy.address
    }

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
