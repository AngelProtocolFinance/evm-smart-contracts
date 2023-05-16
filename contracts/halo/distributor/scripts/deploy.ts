// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path"
import { DistributorMessage } from "typechain-types/contracts/halo/distributor/Distributor"
import { HardhatRuntimeEnvironment } from "hardhat/types"
// const hre = require("hardhat");
// const ethers = hre.ethers;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function distributor(proxyAdmin = ADDRESS_ZERO, DistributorDataInput: DistributorMessage.InstantiateMsgStruct, hre: HardhatRuntimeEnvironment) {
    try {
      const { ethers, run, network } = hre;
      const Distributor = await ethers.getContractFactory('Distributor');
      const DistributorInstance = await Distributor.deploy();
      await DistributorInstance.deployed();
  
      console.log('Distributor implementation address:', DistributorInstance.address);

      const ProxyContract = await ethers.getContractFactory('ProxyContract');

      const DistributorData = DistributorInstance.interface.encodeFunctionData('initialize',[DistributorDataInput]);
  
      const DistributorProxy = await ProxyContract.deploy(DistributorInstance.address, proxyAdmin, DistributorData);
  
      await DistributorProxy.deployed();
  
      console.log('Distributor Address (Proxy):', DistributorProxy.address);

      return Promise.resolve(DistributorProxy.address);
    } catch (error) {
      return Promise.reject(error);
    }
}

