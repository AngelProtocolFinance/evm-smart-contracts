import { task } from "hardhat/config"
import { deployEndowmentMultiSig } from "../../contracts/normalized_endowment/endowment-multisig/scripts/deploy"

task("Deploy:deployEndowmentMultiSig", "Will deploy EndowmentMultiSig contract")
    .addParam("verify", "Want to verify contract")
    .setAction(async (taskArgs, hre) => {
        try {
            var isTrueSet = taskArgs.verify === "true";

            await deployEndowmentMultiSig(isTrueSet, hre);
        } catch (error) {
            console.log(error);
        }
    });
