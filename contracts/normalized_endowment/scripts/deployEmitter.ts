// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { saveFrontendFiles } from "scripts/readWriteFile"

const deploySubDaoEmitter = async (proxyAdmin: string,accountAddress: string,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) =>{
  try {
    const { run,ethers } = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory('ProxyContract');

    const SubdaoEmitter = await ethers.getContractFactory('SubdaoEmitter');
    const SubdaoEmitterImplementation = await SubdaoEmitter.deploy();
    await SubdaoEmitterImplementation.deployed();

    const SubdaoEmitterData = SubdaoEmitterImplementation.interface.encodeFunctionData('initEmitter', [accountAddress]);

    const SubdaoEmitterProxy = await ProxyContract.deploy(SubdaoEmitterImplementation.address, proxyAdmin, SubdaoEmitterData);

    await SubdaoEmitterProxy.deployed();

    if(verify_contracts){
      await run(`verify:verify`, {
        address: SubdaoEmitterImplementation.address,
        constructorArguments: [],
      });
      await run(`verify:verify`, {
        address: SubdaoEmitterProxy.address,
        constructorArguments: [SubdaoEmitterImplementation.address, proxyAdmin, SubdaoEmitterData],
      });
    }

    console.log('SubdaoEmitterProxy Address (Proxy):', SubdaoEmitterProxy.address);

    let subDaoEmitter = {
      SubdaoEmitterProxyAddress: SubdaoEmitterProxy.address,
      SubdaoEmitterImplementationAddress: SubdaoEmitterImplementation.address
    }

    await saveFrontendFiles({subDaoEmitter});

    return Promise.resolve(SubdaoEmitterProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}

const deployDonationMatchEmitter = async (proxyAdmin: string,accountAddress: string,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) =>{
try {
  const {run,ethers} = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory('ProxyContract');

    const DonationMatchEmitter = await ethers.getContractFactory('DonationMatchEmitter');
    const DonationMatchEmitterImplementation = await DonationMatchEmitter.deploy();
    await DonationMatchEmitterImplementation.deployed();

    const DonationMatchEmitterData = DonationMatchEmitterImplementation.interface.encodeFunctionData('initDonationMatchEmiiter', [accountAddress]);

    const DonationMatchEmitterProxy = await ProxyContract.deploy(DonationMatchEmitterImplementation.address, proxyAdmin, DonationMatchEmitterData);

    await DonationMatchEmitterProxy.deployed();

    if(verify_contracts){
      await run(`verify:verify`, {
        address: DonationMatchEmitterImplementation.address,
        constructorArguments: [],
      });
      await run(`verify:verify`, {
        address: DonationMatchEmitterProxy.address,
        constructorArguments: [DonationMatchEmitterImplementation.address, proxyAdmin, DonationMatchEmitterData],
      });
    }

    console.log('DonationMatchEmitterProxy Address (Proxy):', DonationMatchEmitterProxy.address);

    return Promise.resolve(DonationMatchEmitterProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }    
}

export async function deployEmitters(accountAddress: string,verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
  try {
    const {ethers} = hre;

    let [_deployer, proxyAdmin] = await ethers.getSigners();
    const Emitters = {
      subDaoEmitter: await deploySubDaoEmitter(proxyAdmin.address,accountAddress,verify_contracts,hre),
      DonationMatchEmitter: await deployDonationMatchEmitter(proxyAdmin.address,accountAddress,verify_contracts,hre)
    }

    return Promise.resolve(Emitters);
  } catch (error) {
    return Promise.reject(error);
  }
}
