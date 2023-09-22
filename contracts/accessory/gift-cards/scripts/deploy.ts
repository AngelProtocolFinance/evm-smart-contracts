import {HardhatRuntimeEnvironment} from "hardhat/types";
import {GiftCards__factory} from "typechain-types";
import {GiftCardsMessage} from "typechain-types/contracts/accessory/gift-cards/GiftCards";
import {deployBehindProxy, getSigners, updateAddresses, verify} from "utils";

export async function deployGiftCard(
  GiftCardsDataInput: GiftCardsMessage.InstantiateMsgStruct,
  admin: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {deployer} = await getSigners(hre);

    // data setup
    const initData = GiftCards__factory.createInterface().encodeFunctionData("initialize", [
      GiftCardsDataInput,
    ]);
    // deploy
    const {implementation, proxy} = await deployBehindProxy(
      new GiftCards__factory(deployer),
      admin,
      initData
    );

    // update address file
    await updateAddresses(
      {
        giftcards: {
          proxy: proxy.contract.address,
          implementation: implementation.contract.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, implementation);
      await verify(hre, proxy);
    }

    return Promise.resolve(proxy.contract.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
