import {HardhatUserConfig} from "hardhat/config";
import {envConfig} from "./utils";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
require("tsconfig-paths/register"); // must use `require`, otherwise TS complains about missing declaration files
// import "hardhat-abi-exporter"
import "./tasks";

var accounts = [
  envConfig.DEPLOYER.key,
  envConfig.PROXY_ADMIN.key,
  envConfig.AP_TEAM_1.key,
  envConfig.AP_TEAM_2.key,
  envConfig.AP_TEAM_3.key,
];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    mainnet: {
      url: envConfig.MAINNET_RPC_URL,
      accounts: accounts,
    },
    goerli: {
      url: envConfig.GOERLI_RPC_URL,
      accounts: accounts,
    },
    mumbai: {
      url: envConfig.MUMBAI_RPC_URL,
      accounts: accounts,
      // gasPrice: 50_000_000_000 //50Gwei
    },
    polygon: {
      url: envConfig.POLYGON_RPC_URL,
      accounts: accounts,
    },
  },
  mocha: {
    timeout: 400000,
  },
  etherscan: {
    apiKey: {
      etherscan: envConfig.ETHERSCAN_API_KEY,
      goerli: envConfig.ETHERSCAN_API_KEY,
      polygon: envConfig.POLYSCAN_API_KEY,
      polygonMumbai: envConfig.POLYSCAN_API_KEY,
    },
  },
  // abiExporter: [
  //   {
  //       path: "./abi/json",
  //       runOnCompile: true,
  //       clear: true,
  //       flat: false,
  //       spacing: 2,
  //       format: "json",
  //       except: ["IAxelarGateway"],
  //   },
  //   {
  //       path: "./abi/minimal",
  //       runOnCompile: true,
  //       clear: true,
  //       flat: false,
  //       spacing: 2,
  //       format: "minimal",
  //       except: ["IAxelarGateway"],
  //   },
  // ]
};

export default config;
