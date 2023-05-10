import { task } from "hardhat/config"
import addresses from "../../../contract-address.json"
import * as logger from "../../../utils/logger"
import shouldVerify from "../../../utils/shouldVerify"
import cutDiamond from "./cutDiamond"
import deployFacets from "./deployFacets"
import verify from "./verify"

type TaskArguments = { facets: string[] }

task("upgrade:upgradeFacets", "Will redeploy and upgrade all facets that use AccountStorage struct")
    .addVariadicPositionalParam("facets", "List of facets to upgrade")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

            const cuts = await deployFacets(
                taskArguments.facets,
                proxyAdmin,
                addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
                addresses.libraries.STRING_LIBRARY
            )

            await cutDiamond(addresses.accounts.diamond, proxyAdmin, cuts, hre)

            if (shouldVerify(hre.network)) {
                await verify(cuts, addresses.accounts.diamond, proxyAdmin, hre)
            }
        } catch (error) {
            logger.out(`Upgrade facets failed, reason: ${error}`, logger.Level.Error)
        } finally {
            console.log("Done.")
        }
    })
