import { task } from "hardhat/config"
import { envConfig } from "../../utils/env.config"
import { deployRegistrar } from "../../contracts/core/registrar/scripts/deploy"

task("Deploy:deployRegistrar", "Will deploy Registrar contract")
    .addParam("verify", "Want to verify contract")
    .addParam("strlib", "Address of the string Library contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const registrarData = {
                treasury: envConfig.REGISTRAR_DATA.treasury,
                taxRate: envConfig.REGISTRAR_DATA.taxRate,
                rebalance: envConfig.REGISTRAR_DATA.rebalance,
                splitToLiquid: envConfig.REGISTRAR_DATA.splitToLiquid,
                acceptedTokens: envConfig.REGISTRAR_DATA.acceptedTokens,
                router: envConfig.REGISTRAR_DATA.router,
                axelerGateway: envConfig.REGISTRAR_DATA.axelerGateway,
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
