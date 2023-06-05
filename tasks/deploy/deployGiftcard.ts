import {task, types} from "hardhat/config";
import {giftCard} from "contracts/accessory/gift-cards/scripts/deploy";
import {logger, shouldVerify} from "utils";

task("deploy:GiftCard", "Will deploy GiftCardContracts contract")
  .addOptionalParam("verify", "Contract verification flag", false, types.boolean)
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

      const verify_contracts = shouldVerify(hre.network) && taskArgs.verify;

      await giftCard(GiftCardDataInput, taskArgs.corelibrary, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
