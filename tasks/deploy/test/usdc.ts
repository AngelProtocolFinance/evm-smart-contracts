import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import * as logger from "../../../utils/logger"
import * as fs from "fs"
import { DummyUSDC, DummyUSDC__factory } from "../../../typechain-types"
import { BigNumber } from "ethers"
import { time } from "console"

task("deploy:test:usdc")
  .addVariadicPositionalParam("addresses", "who should get the tokens")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    logger.divider()
    const network = await hre.ethers.provider.getNetwork()
    logger.out("Deploying to: " + network.name, logger.Level.Info)
    logger.out("With chain id: " + network.chainId, logger.Level.Info)


    const USDC = await hre.ethers.getContractFactory("DummyUSDC") as DummyUSDC__factory
    const AMOUNT = BigNumber.from("10000000000")

    // Deploy Token
    logger.out("Dummy USDC deploying...")
    const usdc = await USDC.deploy() as DummyUSDC
    await usdc.deployed()
    logger.pad(50, "Dummy USDC deployed to:", usdc.address);

    // Mints
    let mints
    if(taskArguments.addresses[0] != "") {
      mints = true
    }

    if(mints) {
      for(let i=0; i < taskArguments.addresses.length; i++) {
        logger.pad(20, "Minting for ", taskArguments.addresses[i])
        let tx = await usdc.mint(taskArguments.addresses[i], AMOUNT)
        tx.wait()
        logger.out(await usdc.balanceOf(taskArguments.addresses[i]))
    }
    }
    
  
    // Write data to address json
    logger.out("Writing to address.json", logger.Level.Info)
    let rawdata = fs.readFileSync('address.json', "utf8")
    let address: any = JSON.parse(rawdata)
    address[network.chainId] = 
    {
      "usdc": {
        "address": usdc.address
      }
    }
    const json = JSON.stringify(address, null, 2)
    fs.writeFileSync('address.json', json, "utf8")

    // Verify contracts on etherscan
    try {
      await hre.run("verify:verify", {
        address: usdc.address,
        constructorArguments: [],
        contract: "contracts/test/DummyUSDC.sol:DummyUSDC"
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify token:", logger.Level.Warn)
      logger.out(error)
    }
  })