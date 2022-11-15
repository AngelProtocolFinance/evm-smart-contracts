import { ethers, upgrades } from "hardhat";
import * as logger from "../utils/logger"
import * as fs from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Registrar, Registrar__factory } from "../typechain-types"
import { BigNumber } from "ethers";

async function deploy() {

  let deployer: SignerWithAddress
  [deployer] = await ethers.getSigners()
  
  const network = await ethers.provider.getNetwork()

  logger.divider()
  logger.out("Deploying to: " + network.name, logger.Level.Info)
  logger.out("With chain id: " + network.chainId, logger.Level.Info)

  const Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory;
  const registrar = await upgrades.deployProxy(Registrar) as Registrar

  await registrar.deployed();
  logger.pad(30, "Deployed to:", registrar.address);
  logger.out(await registrar.getRebalanceParams())
  logger.out(await registrar.getSplitDetails())
  logger.out(await registrar.getAngelProtocolParams())


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