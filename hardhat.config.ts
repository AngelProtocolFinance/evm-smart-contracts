import { HardhatUserConfig } from "hardhat/config"
import { envConfig } from "./utils/env.config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import '@openzeppelin/hardhat-upgrades'
import "@typechain/hardhat"
import "solidity-coverage"

// Tasks
import "./tasks/accounts"
import "./tasks/deploy"

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