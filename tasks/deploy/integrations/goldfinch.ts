import { task,types } from "hardhat/config"
import type { TaskArguments } from "hardhat/types"
import { logger } from "../../../utils"
import * as fs from "fs"
import { GoldfinchVault, GoldfinchVault__factory, Registrar} from "../../../typechain-types"
import { getImplementationAddress } from '@openzeppelin/upgrades-core'

// Goerli addresses


// Mainnet addresses
// Staking Pool         0xFD6FF39DA508d281C2d255e9bBBfAb34B6be60c3
// CRV LP               0x80aa1a80a30055DAA084E599836532F3e58c95E2
// USDC                 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// FIDU                 0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf
// GFI                  0xdab396cCF3d84Cf2D07C4454e10C8A6F5b008D2b

task("deploy:integrations:goldfinch")
  .addParam("stakingPool", "address of the FIDU stakingPool", "", types.string)
  .addParam("crvPool", "address of the USDC/FIDU LP on CRV", "", types.string)
  .addParam("usdc", "address of the USDC token", "", types.string)
  .addParam("fidu", "address of the FIDU token", "", types.string)
  .addParam("gfi", "address of the GFI token", "", types.string)
  .addOptionalParam("registrar", "address of the registrar. Will do a local lookup from address.json if none is provided", "", types.string)
  .setAction(async function (taskArguments: TaskArguments, hre) {

    logger.divider()
    let registrarAddress
    if(taskArguments.registrar == "") {
      logger.out("Connecting to registrar on specified network...")
      const network = await hre.ethers.provider.getNetwork()
      let rawdata = fs.readFileSync('address.json', "utf8")
      let addresses: any = JSON.parse(rawdata)
      registrarAddress = addresses[network.chainId]["registrar"]["proxy"]
    } else {
      registrarAddress = taskArguments.registrar
    }
    const registrar = await hre.ethers.getContractAt("Registrar",registrarAddress) as Registrar
    logger.pad(50, "Connected to Registrar at: ", registrar.address)

    logger.divider()
    const network = await hre.ethers.provider.getNetwork()
    logger.out("Deploying Goldfinch vaults to: " + network.name, logger.Level.Info)
    logger.out("With chain id: " + network.chainId, logger.Level.Info)

    const Vault = await hre.ethers.getContractFactory("GoldfinchVault") as GoldfinchVault__factory

    // Deploy locked vault
    const lockedVaultArgs = [
      0,
      registrarAddress,
      taskArguments.stakingPool,
      taskArguments.crvPool,
      taskArguments.usdc,
      taskArguments.fidu,
      taskArguments.gfi
    ] as const
    let lockedVault = await Vault.deploy(...lockedVaultArgs) as GoldfinchVault
    await lockedVault.deployed()
    logger.pad(50, "Locked vault deployed to:", lockedVault.address)

    const liquidVaultArgs = [
      1,
      registrarAddress,
      taskArguments.stakingPool,
      taskArguments.crvPool,
      taskArguments.usdc,
      taskArguments.fidu,
      taskArguments.gfi
    ] as const
    let liquidVault = await Vault.deploy(...liquidVaultArgs) as GoldfinchVault
    await liquidVault.deployed()
    logger.pad(50, "Liquid vault deployed to:", liquidVault.address)

    // Write data to address json
    logger.divider()
    logger.out("Writing to address.json", logger.Level.Info)
    let rawdata = fs.readFileSync('address.json', "utf8")
    let address: any = JSON.parse(rawdata)
    address[network.chainId]["goldfinch"] = {
        "lockedVault": lockedVault.address,
        "liquidVault": liquidVault.address
    }
    const json = JSON.stringify(address, null, 2)
    fs.writeFileSync('address.json', json, "utf8")

    // Verify contracts on etherscan
    logger.divider()
    logger.out("Verifying contracts on etherscan")
    try {
      await hre.run("verify:verify", {
        address: lockedVault.address,
        constructorArguments: lockedVaultArgs
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify locked Vault:", logger.Level.Warn)
      logger.out(error)
    }
    try {
      await hre.run("verify:verify", {
        address: liquidVault.address,
        constructorArguments: liquidVaultArgs
      })
    } catch (error){
      logger.out("Caught the following error while trying to verify liquid Vault:", logger.Level.Warn)
      logger.out(error)
    }
  })