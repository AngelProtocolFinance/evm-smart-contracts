import {task, types} from "hardhat/config";
import {isLocalNetwork, logger} from "utils";

import {deployGiftCard} from "contracts/accessory/gift-cards/scripts/deploy";

task("deploy:GiftCard", "Will deploy GiftCardContracts contract")
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .addParam("keeper", "keeper address for giftCard contract")
  .addParam("registraraddress", "Address of the registrar contract")
  .addParam("corelibrary", "Angel core library address")
  .setAction(async (taskArgs, hre) => {
    try {
      let GiftCardDataInput = {
        keeper: taskArgs.keeper,
        registrarContract: taskArgs.registraraddress,
      };

      logger.out(taskArgs.corelibrary);

      const verify_contracts = !isLocalNetwork(hre.network) && taskArgs.verify;

      await deployGiftCard(GiftCardDataInput, taskArgs.corelibrary, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
