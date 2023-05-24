import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { getAddresses } from "utils"
import { IndexFund } from "typechain-types"
import { logger } from "utils"

task(
    "manage:changeOwner",
    "Will update the owner of the specified contract"
).setAction(async (_taskArguments: TaskArguments, hre) => {
    try {
        const addresses = await getAddresses(hre)
        let deployer: SignerWithAddress
        ;[deployer] = await hre.ethers.getSigners()
        const indexfund = (await hre.ethers.getContractAt(
            "IndexFund",
            addresses.indexFundAddress.proxy
        )) as IndexFund

        logger.out("Current owner:")
        let currentConfig = await indexfund.queryConfig()
        logger.out(currentConfig.owner)

        logger.out("Changing owner to:")
        logger.out(addresses.multiSig.APTeamMultiSigProxy)
        // await indexfund.connect(deployer).updateOwner(addresses.multiSig.APTeamMultiSigProxy)
    } catch (error) {
        logger.out(error, logger.Level.Error)
    }
})
