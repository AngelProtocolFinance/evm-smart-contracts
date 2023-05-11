import { task, types } from "hardhat/config"
import type { TaskArguments } from "hardhat/types";
import { Registrar, Registrar__factory } from "typechain-types"
import { logger } from "utils"
import * as fs from "fs"
import { BigNumber } from "ethers";

task("manage:registrar:setAccountsChainAndAddress")
.addParam("chainName", "The Axelar blockchain name of the accounts contract", "", types.string)
.addParam("accountsContractAddress", "Address of the accounts contract on that chain", "", types.string)
  .setAction(async function (taskArguments: TaskArguments, hre) {
    
    logger.divider()
    logger.out("Connecting to registrar on specified network...")
    const network = await hre.ethers.provider.getNetwork()
    let rawdata = fs.readFileSync('address.json', "utf8")
    let addresses: any = JSON.parse(rawdata)
    const registrarAddress = addresses[network.chainId]["registrar"]["proxy"]
    const registrar = await hre.ethers.getContractAt("Registrar",registrarAddress) as Registrar
    logger.pad(50, "Connected to Registrar at: ", registrar.address)

    logger.divider()
    logger.pad(30, "Setting accounts contract on: ", taskArguments.chainName)
    logger.pad(30, "to contract at: ", taskArguments.accountsContractAddress)
    await registrar.setAccountsContractAddressByChain(
      taskArguments.chainName, 
      taskArguments.accountsContractAddress)
  })