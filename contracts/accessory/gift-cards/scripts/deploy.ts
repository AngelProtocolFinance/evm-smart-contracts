// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path"
// const hre = require("hardhat");
// const {ethers,run,network} = require('hardhat');
import { saveFrontendFiles } from "scripts/readWriteFile"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { GiftCardsMessage } from "typechain-types/contracts/accessory/gift-cards/GiftCards"

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function giftCard(GiftCardsDataInput: GiftCardsMessage.InstantiateMsgStruct, ANGEL_CORE_STRUCT: string, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
    try {
      const {ethers,run,network} = hre;
      let [deployer, proxyAdmin] = await ethers.getSigners();
      const GiftCards = await ethers.getContractFactory('GiftCards',{
        libraries:{
            AngelCoreStruct: ANGEL_CORE_STRUCT
        }
      });
      const GiftCardsInstance = await GiftCards.deploy();
      await GiftCardsInstance.deployed();
  
      console.log('GiftCards implementation address:', GiftCardsInstance.address);

      const ProxyContract = await ethers.getContractFactory('ProxyContract');

      const GiftCardsData = GiftCardsInstance.interface.encodeFunctionData('initialize',[GiftCardsDataInput]);
  
      const GiftCardsProxy = await ProxyContract.deploy(GiftCardsInstance.address, proxyAdmin.address, GiftCardsData);
  
      await GiftCardsProxy.deployed();
  
      console.log('GiftCards Address (Proxy):', GiftCardsProxy.address);

      if(verify_contracts){
        await run("verify:verify", {
          address: GiftCardsInstance.address,
          constructorArguments: [],
        });
        await run("verify:verify", {
          address: GiftCardsProxy.address,
          constructorArguments: [GiftCardsInstance.address, proxyAdmin.address, GiftCardsData],
        });
      }
      

      let GiftCardsAddress = {
        GiftCardsProxy: GiftCardsProxy.address,
        GiftCardsImplementation: GiftCardsInstance.address
      }

      await saveFrontendFiles({GiftCardsAddress});

      return Promise.resolve(GiftCardsProxy.address);
    } catch (error) {
      return Promise.reject(error);
    }
}
