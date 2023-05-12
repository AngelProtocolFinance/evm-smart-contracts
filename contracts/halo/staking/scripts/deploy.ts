// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import { Staking } from "typechain-types/contracts/halo/staking/Staking.sol/Staking"
// const hre = require("hardhat");
// const ethers = hre.ethers;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function Staking(proxyAdmin = ADDRESS_ZERO, StakingDataInput: Staking.InstantiateMsgStruct, hre: HardhatRuntimeEnvironment) {
    try {
      const { ethers, run, network } = hre;
      const Staking = await ethers.getContractFactory('Staking');
      const StakingInstance = await Staking.deploy();
      await StakingInstance.deployed();
  
      console.log('Staking implementation address:', StakingInstance.address);

      const ProxyContract = await ethers.getContractFactory('ProxyContract');

      const StakingData = StakingInstance.interface.encodeFunctionData('initialize',[StakingDataInput]);
  
      const StakingProxy = await ProxyContract.deploy(StakingInstance.address, proxyAdmin, StakingData);
  
      await StakingProxy.deployed();
  
      console.log('Staking Address (Proxy):', StakingProxy.address);

      return Promise.resolve(StakingProxy.address);
    } catch (error) {
      return Promise.reject(error);
    }
}

