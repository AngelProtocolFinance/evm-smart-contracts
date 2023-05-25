import { task } from "hardhat/config"

task("gasPrice", "Prints the current gas price on the network", async (_taskArgs, hre) => {
    const response = await fetch("https://gasstation-mumbai.matic.today/v2")
    const gasPrice = await response.json()
    console.log(`Gas info on ${hre.network.name}: ${JSON.stringify(gasPrice, undefined, 2)}`)
})
