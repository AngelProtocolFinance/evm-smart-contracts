import path from "path"
import { saveFrontendFiles } from "scripts/readWriteFile"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { GiftCardsMessage } from "typechain-types/contracts/accessory/gift-cards/GiftCards"

export async function deployGiftCard(
  GiftCardsDataInput: GiftCardsMessage.InstantiateMsgStruct,
  ANGEL_CORE_STRUCT: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
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

    await saveFrontendFiles({
      GiftCardsProxy: GiftCardsProxy.address,
      GiftCardsImplementation: GiftCardsInstance.address
    });

    return Promise.resolve(GiftCardsProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
