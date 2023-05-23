import { task, types } from "hardhat/config"
import type { TaskArguments } from "hardhat/types";
import { Registrar, Registrar__factory } from "typechain-types"
import { logger } from "utils"
import * as fs from "fs"
import { BigNumber } from "ethers";

task("manage:registrar:setGasByToken")
.addParam("tokenAddress", "Address of the token", "", types.string)
.addParam("gas", "Qty of tokens fwd'd to pay for gas. Make sure to use the correct number of decimals!", 0, types.int)
  .setAction(async function (taskArguments: TaskArguments, hre) {
    
    logger.divider()
    logger.out("Connecting to registrar on specified network...")
    const network = await hre.ethers.provider.getNetwork()
    let rawdata = fs.readFileSync("contract-address.json", "utf8")
    let addresses: any = JSON.parse(rawdata)
    const registrarAddress = addresses[network.chainId]["registrar"]["proxy"]
    const registrar = await hre.ethers.getContractAt("Registrar",registrarAddress) as Registrar
    logger.pad(50, "Connected to Registrar at: ", registrar.address)

    logger.divider()
    logger.out("Checking current gas value")
    let currentGasValue = await registrar.getGasByToken(taskArguments.tokenAddress)
    let desiredGasAsBigNumber = BigNumber.from(taskArguments.gas)
    if(currentGasValue.eq(desiredGasAsBigNumber)) {
      logger.pad(10, "Token gas value is already set to", taskArguments.gas)
      return
    }

    logger.divider()
    logger.out("Setting gas for specified token")
    await registrar.setGasByToken(taskArguments.tokenAddress, taskArguments.gas)
  })