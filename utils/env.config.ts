// Env handling:
import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";
import {HardhatNetworkAccountsUserConfig, HardhatNetworkAccountUserConfig} from "hardhat/types";
import {Signer, EnvConfig} from "./types";

dotenvConfig({path: resolve(__dirname, "../.env")});

const AP_TEAM_1: Signer = {
  key: extractString("AP_TEAM_1_KEY"),
  address: extractString("AP_TEAM_1_ADDRESS"),
};

const AP_TEAM_2: Signer = {
  key: extractString("AP_TEAM_2_KEY"),
  address: extractString("AP_TEAM_2_ADDRESS"),
};

const AP_TEAM_3: Signer = {
  key: extractString("AP_TEAM_3_KEY"),
  address: extractString("AP_TEAM_3_ADDRESS"),
};

const DEPLOYER: Signer = {
  key: extractString("DEPLOYER_KEY"),
  address: extractString("DEPLOYER_ADDRESS"),
};

const PROXY_ADMIN_DEV: Signer = {
  key: extractString("PROXY_ADMIN_DEV_KEY"),
  address: extractString("PROXY_ADMIN_DEV_ADDRESS"),
};

const ETHERSCAN_API_KEY = extractString("ETHERSCAN_API_KEY");
const GOERLI_RPC_URL = extractString("GOERLI_RPC_URL");
const GANACHE_PRIVATE_KEY = extractString("GANACHE_PRIVATE_KEY");
const GANACHE_RPC_URL = extractString("GANACHE_RPC_URL");
const MAINNET_RPC_URL = extractString("MAINNET_URL");
const MUMBAI_RPC_URL = extractString("MUMBAI_RPC_URL");
const POLYGON_RPC_URL = extractString("POLYGON_RPC_URL");
const POLYSCAN_API_KEY = extractString("POLYSCAN_API_KEY");
const VERIFY_CONTRACTS = extractString("VERIFY_CONTRACTS");

function extractString(name: string): string {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Please add the ${name} key to your .env file`);
  }
  return envVar;
}

export function getHardhatAccounts(accountList: string[]): HardhatNetworkAccountsUserConfig {
  const hardhatAccounts: HardhatNetworkAccountUserConfig[] = accountList.map((element) => ({
    privateKey: element,
    balance: "1000000000000000000000",
  }));
  return hardhatAccounts;
}

export const envConfigDev: EnvConfig = {
  ETHERSCAN_API_KEY,
  GANACHE_PRIVATE_KEY,
  GANACHE_RPC_URL,
  GOERLI_RPC_URL,
  MAINNET_RPC_URL,
  MUMBAI_RPC_URL,
  POLYGON_RPC_URL,
  POLYSCAN_API_KEY,
  VERIFY_CONTRACTS,
  // order of account items is important!
  ACCOUNTS: [DEPLOYER.key, PROXY_ADMIN_DEV.key, AP_TEAM_1.key, AP_TEAM_2.key, AP_TEAM_3.key],
};

export const envConfigProd: EnvConfig = {
  ETHERSCAN_API_KEY,
  GANACHE_PRIVATE_KEY,
  GANACHE_RPC_URL,
  GOERLI_RPC_URL,
  MAINNET_RPC_URL,
  MUMBAI_RPC_URL,
  POLYGON_RPC_URL,
  POLYSCAN_API_KEY,
  VERIFY_CONTRACTS,
  ACCOUNTS: [DEPLOYER.key, AP_TEAM_1.key, AP_TEAM_2.key, AP_TEAM_3.key],
};
