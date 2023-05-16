// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import { HardhatRuntimeEnvironment } from "hardhat/types"
import path from "path"
import { AirdropMessage } from "typechain-types/contracts/halo/airdrop/Airdrop"
// const hre = require("hardhat");
// const ethers = hre.ethers;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function Airdrop(proxyAdmin = ADDRESS_ZERO, AirdropDataInput: AirdropMessage.InstantiateMsgStruct, hre: HardhatRuntimeEnvironment) {
    try {
      const { ethers, run, network } = hre;
      const Airdrop = await ethers.getContractFactory('Airdrop');
      const AirdropInstance = await Airdrop.deploy();
      await AirdropInstance.deployed();
  
      console.log('Airdrop implementation address:', AirdropInstance.address);

      const ProxyContract = await ethers.getContractFactory('ProxyContract');

      const AirdropData = AirdropInstance.interface.encodeFunctionData('initialize',[AirdropDataInput]);
  
      const AirdropProxy = await ProxyContract.deploy(AirdropInstance.address, proxyAdmin, AirdropData);
  
      await AirdropProxy.deployed();
  
      console.log('Airdrop Address (Proxy):', AirdropProxy.address);

      return Promise.resolve(AirdropProxy.address);
    } catch (error) {
      return Promise.reject(error);
    }
}
