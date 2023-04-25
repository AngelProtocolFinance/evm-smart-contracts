import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import * as logger from "../../../utils/logger"
import * as fs from "fs"
import { DummyERC20, DummyERC20__factory } from "../../../typechain-types"
import { BigNumber } from "ethers"

task("deploy:test:erc20")
  .addVariadicPositionalParam("addresses", "who should get the tokens")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    logger.divider()
    const network = await hre.ethers.provider.getNetwork()
    logger.out("Deploying to: " + network.name, logger.Level.Info)
    logger.out("With chain id: " + network.chainId, logger.Level.Info)


    const Token = await hre.ethers.getContractFactory("DummyERC20") as DummyERC20__factory
    const AMOUNT = BigNumber.from("10000000000000000000000000")

    // Deploy Token
    logger.out("Token deploying...")
    const token = await Token.deploy() as DummyERC20
    await token.deployed()
    logger.pad(50, "Token deployed to:", token.address);

    // Mints
    let mints
    if(taskArguments.addresses[0] != "") {
      mints = true
    }

    if(mints) {
      for(let i=0; i < taskArguments.addresses.length; i++) {
        logger.pad(20, "Minting for ", taskArguments.addresses[i])
        await token.mint(taskArguments.addresses[i], AMOUNT)
        logger.out(await token.balanceOf(taskArguments.addresses[i]))
    }
    }
  
    // Write data to address json
    logger.out("Writing to address.json", logger.Level.Info)
    let rawdata = fs.readFileSync('address.json', "utf8")
    let address: any = JSON.parse(rawdata)
    address[network.chainId] = 
    {
      "token": {
        "address": token.address
      }
    }
    const json = JSON.stringify(address, null, 2)
    fs.writeFileSync('address.json', json, "utf8")

    // Verify contracts on etherscan
    try {
      await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: [],
        contract: "contracts/test/DummyERC20.sol:DummyERC20"
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify token:", logger.Level.Warn)
      logger.out(error)
    }
  })