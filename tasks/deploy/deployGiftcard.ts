import {deployGiftCard} from "contracts/accessory/gift-cards/scripts/deploy.ts";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  angelCoreStruct?: string;
  keeper: string;
  registrar?: string;
  skipVerify: boolean;
};

task("deploy:GiftCard", "Will deploy GiftCardContracts contract")
  .addParam("keeper", "Keeper address for GiftCard contract.")
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const GiftCardDataInput = {
        keeper: taskArgs.keeper,
        registrarContract: registrar,
      };

      await deployGiftCard(GiftCardDataInput, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
