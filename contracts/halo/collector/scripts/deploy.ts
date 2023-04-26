// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import { CollectorMessage } from "../../../../typechain-types/contracts/halo/collector/Collector"
// const hre = require("hardhat");
// const ethers = hre.ethers;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function Collector(proxyAdmin = ADDRESS_ZERO, CollectorDataInput: CollectorMessage.InstantiateMsgStruct, hre: HardhatRuntimeEnvironment) {
    try {
      const { ethers, run, network } = hre;
      const Collector = await ethers.getContractFactory('Collector');
      const CollectorInstance = await Collector.deploy();
      await CollectorInstance.deployed();
  
      console.log('Collector implementation address:', CollectorInstance.address);

      const ProxyContract = await ethers.getContractFactory('ProxyContract');

      const CollectorData = CollectorInstance.interface.encodeFunctionData('initialize',[CollectorDataInput]);
  
      const CollectorProxy = await ProxyContract.deploy(CollectorInstance.address, proxyAdmin, CollectorData);
  
      await CollectorProxy.deployed();
  
      console.log('Collector Address (Proxy):', CollectorProxy.address);

      return Promise.resolve(CollectorProxy.address);
    } catch (error) {
      return Promise.reject(error);
    }
}

