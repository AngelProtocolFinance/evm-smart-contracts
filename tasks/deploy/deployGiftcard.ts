import {CONFIG} from "config";
import {deployGiftCard} from "contracts/accessory/gift-cards/scripts/deploy";
import {task} from "hardhat/config";
import {getAddresses, isLocalNetwork, logger} from "utils";

type TaskArgs = {
  keeper?: string;
  registrar?: string;
  skipVerify: boolean;
};

task("deploy:GiftCard", "Will deploy GiftCardContracts contract")
  .addOptionalParam(
    "keeper",
    "Keeper address for GiftCard contract, will lookup from config if not specified"
  )
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addFlag("skipVerify", "Skip contract verification")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const keeper = taskArgs.keeper || CONFIG.PROD_CONFIG.GiftCardKeeper;
      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      const GiftCardDataInput = {
        keeper: keeper,
        registrarContract: registrar,
      };

      await deployGiftCard(
        GiftCardDataInput,
        addresses.multiSig.apTeam.proxy,
        verify_contracts,
        hre
      );
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
