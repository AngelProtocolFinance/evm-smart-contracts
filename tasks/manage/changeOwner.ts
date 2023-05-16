import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import addresses from "contract-address.json"
import { IndexFund } from "typechain-types"

task(
    "manage:changeOwner",
    "Will update the owner of the specified contract"
).setAction(async (_taskArguments: TaskArguments, hre) => {
    try {
        let deployer: SignerWithAddress
        ;[deployer] = await hre.ethers.getSigners()
        const indexfund = (await hre.ethers.getContractAt(
            "IndexFund",
            addresses.indexFundAddress.indexFundProxy
        )) as IndexFund

        console.log("Current owner:")
        let currentConfig = await indexfund.queryConfig()
        console.log(currentConfig.owner)

        console.log("Changing owner to:")
        console.log(addresses.multiSig.APTeamMultiSigProxy)
        // await indexfund.connect(deployer).updateOwner(addresses.multiSig.APTeamMultiSigProxy)
    } catch (error) {
        console.log(error)
    }
})
