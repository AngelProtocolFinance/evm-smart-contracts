import { HardhatUserConfig } from "hardhat/config";
import { envConfig, accounts } from "./utils/env.config" 
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers"
import '@openzeppelin/hardhat-upgrades';
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "solidity-coverage";
import "hardhat-abi-exporter"
import "./tasks"

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.16",
    settings: {
        optimizer: {
            enabled: true,
            runs: 1000,
        },
        viaIR: true
    },
  },
  networks: {
    "mainnet": {
      url: envConfig.mainnetRPC,
      accounts: accounts
    },
    "goerli": {
      url: envConfig.goerliRPC,
      accounts: accounts
    },
    "mumbai": {
      url: envConfig.mumbaiRPC,
      accounts: accounts
    },
    "polygon": {
      url: envConfig.polygonRPC,
      accounts: accounts
    }
  },
  mocha: {
    timeout: 400000,
  },
  etherscan: {
    apiKey: {
      etherscan: envConfig.etherscanAPIKey,
      goerli: envConfig.etherscanAPIKey,
      polygon: envConfig.polyscanAPIKey,
      polygonMumbai: envConfig.polyscanAPIKey
    }
  },
  abiExporter: [
    {
        path: "./abi/json",
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 2,
        format: "json",
        except: ["IAxelarGateway"],
    },
    {
        path: "./abi/minimal",
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 2,
        format: "minimal",
        except: ["IAxelarGateway"],
    },
]
}

export default config;