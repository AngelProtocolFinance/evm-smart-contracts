import { deployDiamond } from "contracts/core/accounts/scripts/deploy"
import { task } from "hardhat/config"
import { logger } from "utils"

task("Deploy:deployAccountDiamond", "It will deploy account diamond contracts")
    .addParam("apteammultisig", "APTeamMultiSig address")
    .addParam("registrar", "registrar contracts")
    .addParam("corestruct", "core struct address")
    .addParam("stringlib", "string lib address")
    .setAction(async (taskArgs, hre) => {
        try {
            const verify_contracts = hre.network.name !== "hardhat" && hre.network.name !== "localhost"

            await deployDiamond(
                taskArgs.apteammultisig,
                taskArgs.registrar,
                taskArgs.corestruct,
                taskArgs.stringlib,
                hre,
                verify_contracts
            )

            logger.out("Done.")
        } catch (error) {
            logger.out(`Diamond deployment failed, reason: ${error}`, logger.Level.Error)
        }
    })
