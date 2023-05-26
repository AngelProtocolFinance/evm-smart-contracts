// Env handling:
import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";
dotenvConfig({path: resolve(__dirname, "../.env")});

const DEPLOYER: string | undefined = process.env.DEPLOYER_KEY;
if (!DEPLOYER) {
  throw new Error("Please set your DEPLOYER_KEY in a .env file");
}

const PROXYADMIN: string | undefined = process.env.PROXY_ADMIN_KEY;
if (!PROXYADMIN) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_1: string | undefined = process.env.AP_TEAM_1_KEY;
if (!AP_TEAM_1) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_2: string | undefined = process.env.AP_TEAM_2_KEY;
if (!AP_TEAM_2) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_3: string | undefined = process.env.AP_TEAM_3_KEY;
if (!AP_TEAM_3) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const mainnetRPC: string | undefined = process.env.MAINNET_URL;
if (!mainnetRPC) {
  throw new Error("Please set your MAINNET_URL in a .env file");
}

const goerliRPC: string | undefined = process.env.GOERLI_RPC_URL;
if (!goerliRPC) {
  throw new Error("Please set the alchemy GoArby RPC url the .env file");
}

const polygonRPC: string | undefined = process.env.POLYGON_RPC_URL;
if (!polygonRPC) {
  throw new Error("Please set your MAINNET_URL in a .env file");
}

const mumbaiRPC: string | undefined = process.env.MUMBAI_RPC_URL;
if (!mumbaiRPC) {
  throw new Error("Please set the alchemy GoArby RPC url the .env file");
}

const etherscanAPIKey: string | undefined = process.env.ETHERSCAN_API_KEY;
if (!etherscanAPIKey) {
  throw new Error("Please add the Etherscan API key to your .env file");
}

const polyscanAPIKey: string | undefined = process.env.POLYSCAN_API_KEY;
if (!polyscanAPIKey) {
  throw new Error("Please add the Polyscan API key to your .env file");
}

const PROD_NETWORK_ID: number = Number(process.env.PROD_NETWORK_ID);
if (isNaN(PROD_NETWORK_ID)) {
  throw new Error("Please add PROD_NETWORK_ID key with a number value to your .env file");
}

export var accounts = [DEPLOYER, PROXYADMIN, AP_TEAM_1, AP_TEAM_2, AP_TEAM_3];

export var envConfig = {
  DEPLOYER: DEPLOYER,
  PROXYADMIN: PROXYADMIN,
  AP_TEAM_1: AP_TEAM_1,
  AP_TEAM_2: AP_TEAM_2,
  AP_TEAM_3: AP_TEAM_3,
  mainnetRPC: mainnetRPC,
  goerliRPC: goerliRPC,
  polygonRPC: polygonRPC,
  mumbaiRPC: mumbaiRPC,
  etherscanAPIKey: etherscanAPIKey,
  polyscanAPIKey: polyscanAPIKey,
  PROD_NETWORK_ID: PROD_NETWORK_ID,
};
