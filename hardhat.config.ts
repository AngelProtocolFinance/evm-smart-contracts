import { HardhatUserConfig, task } from "hardhat/config";
import { envConfig } from "./utils/env.config" 
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers"
import '@openzeppelin/hardhat-upgrades';
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "solidity-coverage";
import { env } from "process";

// require('hardhat-contract-sizer')

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity:{
    version: "0.8.15",
    settings: {
      optimizer: { 
        enabled: true, 
        runs: 200
      }
    }
  },
  networks: {
    "mainnet": {
      url: envConfig.mainnetRPC,
      accounts: [envConfig.deployer, envConfig.user]
    },
    "goerli": {
      url: envConfig.goerliRPC,
      accounts: [envConfig.deployer, envConfig.user]
    },
    "mumbai": {
      url: envConfig.mumbaiRPC,
      accounts: [envConfig.deployer, envConfig.user]
    },
    "polygon": {
      url: envConfig.polygonRPC,
      accounts: [envConfig.deployer, envConfig.user]
    }
  },
  etherscan: {
    apiKey: {
      etherscan: envConfig.etherscanAPIKey,
      goerli: envConfig.etherscanAPIKey,
      polygon: envConfig.polyscanAPIKey,
      polygonMumbai: envConfig.polyscanAPIKey
    }
  }
}

export default config;