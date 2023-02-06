import { task, types } from "hardhat/config"
import { Registrar, Registrar__factory } from "../../../typechain-types"
import * as logger from "../../../utils/logger"
import * as fs from "fs"

const NULL_NUMBER = 0
const NULL_STRING = ""

task("manage:registrar:setAPParams", "Set any or all of the AP params. This task only modifies specified optional args")
  .addOptionalParam("protocolTaxRate", "The protocol tax rate as a percent (i.e. 2 => 2%)", NULL_NUMBER, types.int)
  .addOptionalParam("protocolTaxBasis", "The protocol tax basis for setting precision", NULL_NUMBER, types.int)
  .addOptionalParam("protocolTaxCollector", "Address of the protocol tax collector", NULL_STRING, types.string)
  .addOptionalParam("primaryChain", "The chain where the Accounts contract lives", NULL_STRING, types.string)
  .addOptionalParam("primaryChainRouter", "The address of the primary chains router", NULL_STRING, types.string)
  .addOptionalParam("routerAddress", "The address of this chains router", NULL_STRING, types.string)
  .addOptionalParam("refundAddress", "The address of this chains fallback refund collector", NULL_STRING, types.string)
  .setAction(async function ({
    protocolTaxRate, 
    protocolTaxBasis,
    protocolTaxCollector,
    primaryChain,
    primaryChainRouter,
    routerAddress,
    refundAddress
  }, hre) {

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
    logger.pad(50,"Current primary chain: ", currentAPParams.primaryChain)
    logger.pad(50,"Current primary chain router: ", currentAPParams.primaryChainRouter)
    logger.pad(50,"Current router address: ", currentAPParams.routerAddr)
    logger.pad(50,"Current refund address: ", currentAPParams.refundAddr)

    logger.divider()
    let newTaxRate = checkIfDefaultAndSet(protocolTaxRate, currentAPParams.protocolTaxRate)
    let newTaxBasis = checkIfDefaultAndSet(protocolTaxBasis, currentAPParams.protocolTaxBasis)
    let newTaxCollector = checkIfDefaultAndSet(protocolTaxCollector, currentAPParams.protocolTaxCollector)
    let newPrimaryChain = checkIfDefaultAndSet(primaryChain, currentAPParams.primaryChain)
    let newPrimaryChainRouter = checkIfDefaultAndSet(primaryChainRouter, currentAPParams.primaryChainRouter)
    let newRouterAddress = checkIfDefaultAndSet(routerAddress, currentAPParams.routerAddr)
    let newRefundAddress = checkIfDefaultAndSet(refundAddress, currentAPParams.refundAddr)

    logger.out("Setting AP params to:")
    logger.pad(50,"New tax rate: ", newTaxRate)
    logger.pad(50,"New tax basis: ", newTaxBasis)
    logger.pad(50,"New tax collector: ", newTaxCollector)
    logger.pad(50,"New primary chain: ", newPrimaryChain)
    logger.pad(50,"New primary chain router: ", newPrimaryChainRouter)
    logger.pad(50,"New router address: ", newRouterAddress)
    logger.pad(50,"New refund address: ", newRefundAddress)
    await registrar.setAngelProtocolParams({
      "protocolTaxRate": newTaxRate,
      "protocolTaxBasis": newTaxBasis,
      "protocolTaxCollector": newTaxCollector,
      "primaryChain": newPrimaryChain,
      "primaryChainRouter": newPrimaryChainRouter,
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