import { task, types } from "hardhat/config"
import type { TaskArguments } from "hardhat/types";
import { Registrar, Registrar__factory } from "../../../typechain-types"
import * as logger from "../../../utils/logger"
import * as fs from "fs"

task("manage:registrar:setTokenAccepted")
.addParam("tokenAddress", "Address of the token", "", types.string)
.addParam("acceptanceState", "Boolean for acceptance state", false, types.boolean)
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
    logger.out("Checking token acceptance state")
    let tokenAccepted = await registrar.isTokenAccepted(taskArguments.tokenAddress)
    if(tokenAccepted == taskArguments.acceptanceState) {
      logger.out("Token acceptance is already set")
      return
    }
    logger.pad(30, "Token acceptance is currently set to", tokenAccepted)
    
    logger.divider()
    logger.out("Setting token acceptance")
    await registrar.setTokenAccepted(taskArguments.tokenAddress, taskArguments.acceptanceState)
  })