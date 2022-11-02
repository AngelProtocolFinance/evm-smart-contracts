import { HardhatUserConfig, task } from "hardhat/config";
import { envConfig } from "./utils/env.config" 
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import { env } from "process";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    "mumbai": {
      url: envConfig.testnetRPC,
      accounts: [envConfig.deployer, envConfig.user]
    },
    "polygon": {
      url: envConfig.mainnetRPC,
      accounts: [envConfig.deployer, envConfig.user]
    }
  },
  etherscan: {
    apiKey: {
      polygon: envConfig.polyscanAPIKey,
      polygonMumbai: envConfig.polyscanAPIKey
    }
  }
}

export default config;