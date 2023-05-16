import { task } from "hardhat/config"
import config from "config"
import { deployLockedWithdraw } from "contracts/normalized_endowment/locked-withdraw/scripts/deploy"

task(
    "Deploy:deployLockedWithdraw",
    "Will deploy LockedWithdraw contract"
)
    .addParam("verify", "Want to verify contract")
    .addParam("registraraddress", "Address of the registrar")
    .addParam("accountaddress", "Address of the account")
    .addParam("multisigaddress", "Address of the AP team multisig")
    .addParam("endowfactory", "Address of the endowfactory")
    .setAction(async (taskArgs, hre) => {

        try {
            let LockedWithdrawDataInput = [
                taskArgs.registraraddress,
                taskArgs.accountaddress,
                taskArgs.multisigaddress,
                taskArgs.endowfactory
            ];
            var isTrueSet = taskArgs.verify === "true";
            await deployLockedWithdraw(config.PROXY_ADMIN_ADDRESS, LockedWithdrawDataInput, isTrueSet, hre);
        } catch (error) {
            console.log(error);
        }
    });
