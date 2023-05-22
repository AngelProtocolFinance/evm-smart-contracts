import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { MultiSigGeneric } from "typechain-types"
import { logger } from "utils"

task("manage:addMultisigOwner", "Will add the specified address to the multisig as an owner")
    .addParam("multisig", "Address of multisig")
    .addParam("owner", "Address of the new owner")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            let deployer: SignerWithAddress
            let apTeam1: SignerWithAddress
            let apTeam2: SignerWithAddress
            let apTeam3: SignerWithAddress
            ;[deployer, apTeam1, apTeam2, apTeam3] = await hre.ethers.getSigners()

            const multisig = (await hre.ethers.getContractAt("MultiSigGeneric", taskArguments.multisig)) as MultiSigGeneric

            console.log("Current owners")
            let currentOwners = await multisig.getOwners()
            console.log(currentOwners)

            console.log("Adding new owner:")
            console.log(taskArguments.owner)
            const { data } = await multisig.populateTransaction.addOwner(taskArguments.owner)
            const addOwnerData = hre.ethers.utils.toUtf8Bytes(data!)

            let tx = await multisig.connect(apTeam2).submitTransaction(
                "add owner", //title
                "add ap team 3 as owner", //description
                multisig.address, //destination,
                0, //value
                addOwnerData //data)
            )
            await hre.ethers.provider.waitForTransaction(tx.hash)

            console.log("Owner addition successful. New owner list:")
            currentOwners = await multisig.getOwners()
            console.log(currentOwners)
        } catch (error) {
            logger.out(error, logger.Level.Error)
        }
    })
