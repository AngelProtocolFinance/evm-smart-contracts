import { ethers, upgrades } from "hardhat";
import { logger } from "utils"
import * as fs from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Halo, Halo__factory } from "typechain-types"
import { BigNumber } from "ethers";

async function deploy() {

  let deployer: SignerWithAddress
  [deployer] = await ethers.getSigners()

  // @TODO replace these with valid values
  let SUPPLY = BigNumber.from(10).pow(27) // 1 Billion tokens with 18 decimals 
  let recipient: string = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth
  const network = await ethers.provider.getNetwork()

  logger.divider()
  logger.out("Deploying to: " + network.name, logger.Level.Info)
  logger.out("With chain id: " + network.chainId, logger.Level.Info)

  const Halo = await ethers.getContractFactory("Halo") as Halo__factory;
  const halo = await Halo.deploy(recipient, SUPPLY)

  await halo.deployed();
  logger.pad(30, "Deployed to:", halo.address);

  logger.divider()
  logger.out("Writing to contract-address.json", logger.Level.Info)

  let rawdata = fs.readFileSync("contract-address.json", "utf8")
  let address: any = JSON.parse(rawdata)
  address[network.chainId] = {"halo": halo.address}
  const json = JSON.stringify(address, null, 2)
  fs.writeFileSync("contract-address.json", json, "utf8")
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});