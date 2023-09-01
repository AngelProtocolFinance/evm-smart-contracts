import {HardhatUserConfig} from "hardhat/config";
import {HardhatNetworkAccountsUserConfig} from "hardhat/types";
import {envConfigDev, envConfigProd, getHardhatAccounts} from "./utils";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
require("tsconfig-paths/register"); // must use `require`, otherwise TS complains about missing declaration files
import "./tasks";
import * as tdly from "@tenderly/hardhat-tenderly";

var hardhatAccounts: HardhatNetworkAccountsUserConfig = getHardhatAccounts(envConfigDev.ACCOUNTS);

tdly.setup({
  automaticVerifications: false,
});

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    mainnet: {
      url: envConfigProd.MAINNET_RPC_URL,
      accounts: envConfigProd.ACCOUNTS,
    },
    goerli: {
      url: envConfigDev.GOERLI_RPC_URL,
      accounts: envConfigDev.ACCOUNTS,
    },
    mumbai: {
      url: envConfigDev.MUMBAI_RPC_URL,
      accounts: envConfigDev.ACCOUNTS,
    },
    polygon: {
      url: envConfigProd.POLYGON_RPC_URL,
      accounts: envConfigProd.ACCOUNTS,
    },
    hardhat: {
      accounts: hardhatAccounts,
    },
  },
  mocha: {
    timeout: 400000,
  },
  etherscan: {
    apiKey: {
      mainnet: envConfigProd.ETHERSCAN_API_KEY,
      goerli: envConfigDev.ETHERSCAN_API_KEY,
      polygon: envConfigProd.POLYSCAN_API_KEY,
      polygonMumbai: envConfigDev.POLYSCAN_API_KEY,
    },
  },
  tenderly: {
    username: "angelprotocol",
    project: "ap",
    privateVerification: true,
  },
};

export default config;
