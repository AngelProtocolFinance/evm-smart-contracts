import { task } from "hardhat/config";
import * as logger from "../../utils/logger";

task(
    "upgrade:upgradeContractsUsingAccountStorage",
    "Will redeploy all contracts that use AccountStorage struct"
).setAction(async (_taskArguments, hre) => {
    try {
        await hre.run("upgrade:upgradeCharityApplication");
        await hre.run("upgrade:upgradeFacetsUsingAccountStorage");
    } catch (error) {
        logger.out(
            `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
            logger.Level.Error
        );
    }
});
