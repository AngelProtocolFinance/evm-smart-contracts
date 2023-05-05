import { task, types } from "hardhat/config";
import * as logger from "../../utils/logger";

type TaskArguments = { verify: boolean };

task("upgrade:upgradeContractsUsingAccountStorage", "Will redeploy all contracts that use AccountStorage struct")
    .addOptionalParam("verify", "Flag specifying whether to verify the contract", false, types.boolean)
    .setAction(async ({ verify }: TaskArguments, hre) => {
        try {
            await hre.run("upgrade:upgradeCharityApplication", { verify });
            await hre.run("upgrade:upgradeFacetsUsingAccountStorage", { verify });
        } catch (error) {
            logger.out(
                `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
                logger.Level.Error
            );
        }
    });
