import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getContractName, getSigners, logger, updateAddresses, verify} from "utils";
import {GiftCardsMessage} from "typechain-types/contracts/accessory/gift-cards/GiftCards";
import {GiftCards__factory, ProxyContract__factory} from "typechain-types";

export async function deployGiftCard(
  GiftCardsDataInput: GiftCardsMessage.InstantiateMsgStruct,
  admin: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);

    const GiftCards = new GiftCards__factory(deployer);
    const GiftCardsInstance = await GiftCards.deploy();
    await GiftCardsInstance.deployed();
    logger.out(`GiftCards implementation address: ${GiftCardsInstance.address}"`);

    const ProxyContract = new ProxyContract__factory(deployer);
    const GiftCardsData = GiftCardsInstance.interface.encodeFunctionData("initialize", [
      GiftCardsDataInput,
    ]);
    const GiftCardsProxy = await ProxyContract.deploy(
      GiftCardsInstance.address,
      admin,
      GiftCardsData
    );
    await GiftCardsProxy.deployed();
    logger.out(`GiftCards Address (Proxy): ${GiftCardsProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        giftcards: {
          proxy: GiftCardsProxy.address,
          implementation: GiftCardsInstance.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {
        address: GiftCardsProxy.address,
        constructorArguments: [GiftCardsInstance.address, admin, GiftCardsData],
        contractName: getContractName(GiftCards),
      });
    }

    return Promise.resolve(GiftCardsProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
