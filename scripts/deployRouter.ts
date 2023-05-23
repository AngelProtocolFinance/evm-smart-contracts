import { ethers, upgrades } from "hardhat";
import { logger } from "utils"
import * as fs from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Router, Router__factory } from "typechain-types"
import { BigNumber } from "ethers";

async function deploy() {

  let deployer: SignerWithAddress
  [deployer] = await ethers.getSigners()

  const network = await ethers.provider.getNetwork()

  let rawdata = fs.readFileSync("contract-address.json", "utf8")
  let address: any = JSON.parse(rawdata)

  logger.divider()
  logger.out("Deploying to: " + network.name, logger.Level.Info)
  logger.out("With chain id: " + network.chainId, logger.Level.Info)

  const gatewayAddress = ""
  const gasReceiverAddress = ""
  const registrarAddress = address[network.chainId]["registrar"]

  const Router = await ethers.getContractFactory("Router__factory") as Router__factory;
  const router = await upgrades.deployProxy(
    Router,
    [gatewayAddress,
      gasReceiverAddress,
      registrarAddress]) as Router

  await router.deployed();
  logger.pad(30, "Deployed to:", router.address);

  logger.divider()
  logger.out("Writing to contract-address.json", logger.Level.Info)

  address[network.chainId] = router.address
  const json = JSON.stringify(address, null, 2)
  fs.writeFileSync("contract-address.json", json, "utf8")
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});