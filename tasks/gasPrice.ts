import { task } from "hardhat/config"

task("gasPrice", "Prints the current gas price on the network", async (_taskArgs, hre) => {
    const response = await fetch("https://matic-mumbai.chainstacklabs.com", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_gasPrice",
            params: [],
            id: "1", // * Must be unique in case of batching
        }),
    })
    const gasPrice = await response.json()
    console.log(`Gas price (in Gwei) on ${hre.network.name}: ${parseInt(gasPrice.result, 16) / 10e9}`)
})
