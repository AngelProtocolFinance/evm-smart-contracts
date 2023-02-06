import { task } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import * as logger from "../../utils/logger"
import * as fs from "fs"
import { Router, Router__factory } from "../../typechain-types"
import { Registrar, Registrar__factory } from "../../typechain-types"
import { getImplementationAddress } from '@openzeppelin/upgrades-core'

// Goerli addresses
// Axelar Gateway:      0xe432150cce91c13a887f7D836923d5597adD8E31
// Axelar Gas Service:  0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6 

// Mainnet addresses
// Axelar Gateway:      0x4F4495243837681061C4743b74B3eEdf548D56A5
// Axelar Gas Service:  0x2d5d7d31F671F86C782533cc367F14109a082712

task("deploy:RouterAndRegistrar")
  .addParam("gateway", "Axelar GMP gateway address")
  .addParam("gas", "Axelar GMP gas rcvr address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    logger.divider()
    const network = await hre.ethers.provider.getNetwork()
    logger.out("Deploying to: " + network.name, logger.Level.Info)
    logger.out("With chain id: " + network.chainId, logger.Level.Info)

    const Registrar = await hre.ethers.getContractFactory("Registrar") as Registrar__factory
    const Router = await hre.ethers.getContractFactory("Router") as Router__factory

    // Deploy Registrar
    logger.out("Registrar deploying...")
    const registrar = await hre.upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed()
    logger.pad(50, "Registrar deployed to:", registrar.address);
    const registrarImplAddress = await getImplementationAddress(hre.ethers.provider, registrar.address)
    logger.pad(50, "with the current implementation at: ", registrarImplAddress)

    // Deploy Router
    logger.out("Router deploying...")
    const RouterArgs = [
      taskArguments.gateway,
      taskArguments.gas,
      registrar.address
    ]
    const router = await hre.upgrades.deployProxy(
        Router,
        RouterArgs) as Router
    await router.deployed()
    logger.pad(50, "Router deployed to:", router.address)
    const routerImplAddress = await getImplementationAddress(hre.ethers.provider, router.address)
    logger.pad(50, "with the current implementation at: ", routerImplAddress)
    logger.divider()

    // Write data to address json
    logger.out("Writing to address.json", logger.Level.Info)
    let rawdata = fs.readFileSync('address.json', "utf8")
    let address: any = JSON.parse(rawdata)
    address[network.chainId] = 
    {
      "registrar": {
        "proxy": registrar.address,
        "impl": registrarImplAddress
      },
      "router": {
        "proxy": router.address,
        "impl": routerImplAddress
    }
    }
    const json = JSON.stringify(address, null, 2)
    fs.writeFileSync('address.json', json, "utf8")

    // Verify contracts on etherscan
    try {
      await hre.run("verify:verify", {
        address: registrarImplAddress,
        constructorArguments: []
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify registrar:", logger.Level.Warn)
      logger.out(error)
    }
    try {
      await hre.run("verify:verify", {
        address: routerImplAddress,
        constructorArguments: []
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify router:", logger.Level.Warn)
      logger.out(error)
    }
  })