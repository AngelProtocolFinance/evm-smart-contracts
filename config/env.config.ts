// Env handling:
import dotenv from "dotenv";
import {HardhatNetworkAccountsUserConfig, HardhatNetworkAccountUserConfig} from "hardhat/types";
import {EnvConfig} from "./types";

dotenv.config({path: __dirname + "/./../.env"});

const DEPLOYER_KEY = extractString("DEPLOYER_KEY");
const PROXY_ADMIN_DEV_KEY = extractString("PROXY_ADMIN_KEY");
const AP_TEAM_1_KEY = extractString("AP_TEAM_1_KEY");
const AP_TEAM_2_KEY = extractString("AP_TEAM_2_KEY");
const AP_TEAM_3_KEY = extractString("AP_TEAM_3_KEY");

const ETHERSCAN_API_KEY = extractString("ETHERSCAN_API_KEY");
const GOERLI_RPC_URL = extractString("GOERLI_RPC_URL");
const GANACHE_PRIVATE_KEY = extractString("GANACHE_PRIVATE_KEY");
const GANACHE_RPC_URL = extractString("GANACHE_RPC_URL");
const MAINNET_RPC_URL = extractString("MAINNET_URL");
const MUMBAI_RPC_URL = extractString("MUMBAI_RPC_URL");
const POLYGON_RPC_URL = extractString("POLYGON_RPC_URL");
const POLYSCAN_API_KEY = extractString("POLYSCAN_API_KEY");

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
  // order of account items is important!
  ACCOUNTS: [DEPLOYER_KEY, PROXY_ADMIN_DEV_KEY, AP_TEAM_1_KEY, AP_TEAM_2_KEY, AP_TEAM_3_KEY],
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
  ACCOUNTS: [DEPLOYER_KEY, AP_TEAM_1_KEY, AP_TEAM_2_KEY, AP_TEAM_3_KEY],
};
