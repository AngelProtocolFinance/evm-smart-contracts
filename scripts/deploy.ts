import { ethers, upgrades } from "hardhat";
import * as logger from "../utils/logger"
import * as fs from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Registrar__factory } from "../typechain-types"

async function deploy() {

  let deployer: SignerWithAddress
  [deployer] = await ethers.getSigners()
  
  const network = await ethers.provider.getNetwork()

  logger.divider()
  logger.out("Deploying to: " + network.name, logger.Level.Info)
  logger.out("With chain id: " + network.chainId, logger.Level.Info)

  const DefaultRebalanceParams = {
    rebalanceLiquidProfits: false,
    lockedRebalanceToLiquid: false,
    interestDistribution: 20,
    lockedPrincipleToLiquid: false, 
    principleDistribution: 0
  }

  const DefaultSplitDetails = {
    min: 0,
    max: 100,
    nominal: 50
  }

  const DefaultAngelProtocolParams = {
    protocolTaxRate: 200,
    protocolTaxBasis: 100
  }

  const Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory;
  const registrar = await upgrades.deployProxy(Registrar,
    [
      deployer.address,
      DefaultAngelProtocolParams,
      DefaultSplitDetails,
      DefaultAngelProtocolParams
    ]
  );

  await registrar.deployed();
  logger.pad(30, "Deployed to:", registrar.address);
  logger.out(await registrar.getAngelProtocolParams())


  const UpdatedAngelProtocolParams = {
    protocolTaxRate: 0,
    protocolTaxBasis: 0
  }

  const upgraded = await upgrades.upgradeProxy(registrar.address, Registrar)
  


  // logger.divider()
  // logger.out("Writing to address.json", logger.Level.Info)

  // let rawdata = fs.readFileSync('address.json', "utf8")
  // let address: any = JSON.parse(rawdata)
  // address[network.chainId] = lock.address
  // const json = JSON.stringify(address, null, 2)
  // fs.writeFileSync('address.json', json, "utf8")
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});