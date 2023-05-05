import { task, types } from "hardhat/config";
import * as logger from "../../utils/logger";

type TaskArguments = { verify_contracts: boolean };

task(
    "upgrade:upgradeContractsUsingAccountStorage",
    "Will redeploy all contracts that use AccountStorage struct"
)
    .addOptionalParam(
        "verify_contracts",
        "Flag specifying whether to verify the contract",
        false,
        types.boolean
    )
    .setAction(async ({ verify_contracts }: TaskArguments, hre) => {
        try {
            await hre.run("upgrade:upgradeCharityApplication", {
                verify_contracts,
            });
            await hre.run("upgrade:upgradeFacetsUsingAccountStorage");
        } catch (error) {
            logger.out(
                `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
                logger.Level.Error
            );
        }
    });
