import { task } from "hardhat/config"
import { giftCard } from "contracts/accessory/gift-cards/scripts/deploy"

task("Deploy:deployGiftCard", "Will deploy GiftCardContracts contract")
    .addParam("verify", "Want to verify contract")
    .addParam("keeper", "keeper address for giftCard contract")
    .addParam("registraraddress", "Address of the registrar contract")
    .addParam("corelibrary", "Angel core library address")
    .setAction(async (taskArgs, hre) => {
        try {
            let GiftCardDataInput = {
                keeper: taskArgs.keeper,
                registrarContract: taskArgs.registraraddress,
            };

            console.log(taskArgs.corelibrary);

            var isTrueSet = taskArgs.verify === "true";

            await giftCard(
                GiftCardDataInput,
                taskArgs.corelibrary,
                isTrueSet,
                hre
            );
        } catch (error) {
            console.log(error);
        }
    });
