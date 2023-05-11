import { task, types } from "hardhat/config"
import type { TaskArguments } from "hardhat/types";
import { Registrar, Registrar__factory } from "../../../typechain-types"
import { logger } from "../../../utils"
import * as fs from "fs"

const NULL_NUMBER = 0
const NULL_STRING = ""

task("manage:registrar:setAPParams", "Set any or all of the AP params. This task only modifies specified optional args")
  .addOptionalParam("protocolTaxRate", "The protocol tax rate as a percent (i.e. 2 => 2%)", NULL_NUMBER, types.int)
  .addOptionalParam("protocolTaxBasis", "The protocol tax basis for setting precision", NULL_NUMBER, types.int)
  .addOptionalParam("protocolTaxCollector", "Address of the protocol tax collector", NULL_STRING, types.string)
  .addOptionalParam("routerAddress", "The address of this chains router", NULL_STRING, types.string)
  .addOptionalParam("refundAddress", "The address of this chains fallback refund collector", NULL_STRING, types.string)
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
    logger.out("Fetching current AP params...")
    let currentAPParams = await registrar.getAngelProtocolParams()
    logger.pad(50,"Current tax rate: ", currentAPParams.protocolTaxRate)
    logger.pad(50,"Current tax basis: ", currentAPParams.protocolTaxBasis)
    logger.pad(50,"Current tax collector: ", currentAPParams.protocolTaxCollector)
    logger.pad(50,"Current router address: ", currentAPParams.routerAddr)
    logger.pad(50,"Current refund address: ", currentAPParams.refundAddr)

    logger.divider()
    let newTaxRate = checkIfDefaultAndSet(taskArguments.protocolTaxRate, currentAPParams.protocolTaxRate)
    let newTaxBasis = checkIfDefaultAndSet(taskArguments.protocolTaxBasis, currentAPParams.protocolTaxBasis)
    let newTaxCollector = checkIfDefaultAndSet(taskArguments.protocolTaxCollector, currentAPParams.protocolTaxCollector)
    let newRouterAddress = checkIfDefaultAndSet(taskArguments.routerAddress, currentAPParams.routerAddr)
    let newRefundAddress = checkIfDefaultAndSet(taskArguments.refundAddress, currentAPParams.refundAddr)

    logger.out("Setting AP params to:")
    logger.pad(50,"New tax rate: ", newTaxRate)
    logger.pad(50,"New tax basis: ", newTaxBasis)
    logger.pad(50,"New tax collector: ", newTaxCollector)
    logger.pad(50,"New router address: ", newRouterAddress)
    logger.pad(50,"New refund address: ", newRefundAddress)
    await registrar.setAngelProtocolParams({
      "protocolTaxRate": newTaxRate,
      "protocolTaxBasis": newTaxBasis,
      "protocolTaxCollector": newTaxCollector,
      "routerAddr": newRouterAddress,
      "refundAddr": newRefundAddress
    })
  })

function checkIfDefaultAndSet(taskArg: any, currentValue: any) {
  let defaultValue: any
  if(typeof(taskArg == Number)) {
    defaultValue = NULL_NUMBER
  }
  else {
    defaultValue = NULL_STRING
  }
  if(taskArg == defaultValue) {
    return currentValue
  }
  else if(taskArg == currentValue) {
    return currentValue
  }
  else {
    return taskArg
  }
}