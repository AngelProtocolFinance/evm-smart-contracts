import { task } from "hardhat/config"
import config from "config"
import { deployRegistrar } from "contracts/core/registrar/scripts/deploy"

task("Deploy:deployRegistrar", "Will deploy Registrar contract")
    .addParam("verify", "Want to verify contract")
    .addParam("strlib", "Address of the string Library contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const registrarData = {
                treasury: config.REGISTRAR_DATA.treasury,
                taxRate: config.REGISTRAR_DATA.taxRate,
                rebalance: config.REGISTRAR_DATA.rebalance,
                splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
                acceptedTokens: config.REGISTRAR_DATA.acceptedTokens,
                router: config.REGISTRAR_DATA.router,
                axelerGateway: config.REGISTRAR_DATA.axelerGateway,
            };
            var isTrueSet = taskArgs.verify === "true";
            await deployRegistrar(
                taskArgs.strlib,
                registrarData,
                isTrueSet,
                hre
            );
        } catch (error) {
            console.log(error);
        }
    });
