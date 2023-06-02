// Env handling:
import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";

dotenvConfig({path: resolve(__dirname, "../.env")});

type Signer = {key: string; address: string};

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

const PROXY_ADMIN: Signer = {
  key: extractString("PROXY_ADMIN_KEY"),
  address: extractString("PROXY_ADMIN_ADDRESS"),
};

const ETHERSCAN_API_KEY = extractString("ETHERSCAN_API_KEY");
const GOERLI_RPC_URL = extractString("GOERLI_RPC_URL");
const GANACHE_PRIVATE_KEY = extractString("GANACHE_PRIVATE_KEY");
const GANACHE_RPC_URL = extractString("GANACHE_RPC_URL");
const MAINNET_RPC_URL = extractString("MAINNET_URL");
const MUMBAI_RPC_URL = extractString("MUMBAI_RPC_URL");
const NETWORK = extractString("NETWORK");
const OPTIMIZER_FLAG = extractString("OPTIMIZER_FLAG");
const OPTIMIZER_RUNS = extractNumber("OPTIMIZER_RUNS");
const POLYGON_RPC_URL = extractString("POLYGON_RPC_URL");
const POLYSCAN_API_KEY = extractString("POLYSCAN_API_KEY");
const PROD_NETWORK_ID = extractNumber("PROD_NETWORK_ID");
const ROUTER_ADDRESS = extractString("ROUTER_ADDRESS");
const VERIFY_CONTRACTS = extractString("VERIFY_CONTRACTS");

// tokens
const USDC_ADDRESS = extractString("USDC_ADDRESS");
const USDC_ADDRESS_MUMBAI = extractString("USDC_ADDRESS_MUMBAI");

function extractNumber(name: string): number {
  const envVar = extractString(name);

  const numVar = Number(envVar);
  if (isNaN(numVar)) {
    throw new Error(`Please add ${name} key with a number value to your .env file`);
  }

  return numVar;
}

function extractString(name: string): string {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Please add the ${name} key to your .env file`);
  }
  return envVar;
}

export var envConfig = {
  AP_TEAM_1,
  AP_TEAM_2,
  AP_TEAM_3,
  DEPLOYER,
  PROXY_ADMIN,
  ETHERSCAN_API_KEY,
  GANACHE_PRIVATE_KEY,
  GANACHE_RPC_URL,
  GOERLI_RPC_URL,
  MAINNET_RPC_URL,
  MUMBAI_RPC_URL,
  NETWORK,
  OPTIMIZER_FLAG,
  OPTIMIZER_RUNS,
  POLYGON_RPC_URL,
  POLYSCAN_API_KEY,
  PROD_NETWORK_ID,
  ROUTER_ADDRESS,
  VERIFY_CONTRACTS,
  USDC_ADDRESS,
  USDC_ADDRESS_MUMBAI,
};
