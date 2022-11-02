// Env handling: 
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });


const deployer: string | undefined = process.env.DEPLOYER_KEY;
if (!deployer) {
  throw new Error("Please set your DEPLOYER_KEY in a .env file");
}

const user: string | undefined = process.env.USER_KEY;
if (!user) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const mainnetRPC: string | undefined = process.env.MAINNET_URL;
if (!mainnetRPC) {
  throw new Error("Please set your MAINNET_URL in a .env file");
}

const testnetRPC: string | undefined = process.env.TESTNET_URL
if (!testnetRPC) {
  throw new Error("Please set the alchemy GoArby RPC url the .env file")
}

const polyscanAPIKey: string | undefined = process.env.POLYSCAN_API_KEY
if (!polyscanAPIKey) {
  throw new Error("Please add the Etherscan API key to your .env file")
}


export var envConfig = {
  'deployer': deployer,
  'user': user, 
  'mainnetRPC': mainnetRPC,
  'testnetRPC': testnetRPC,
  'etherscanAPIKey': polyscanAPIKey
}