export type Signer = {key: string; address: string};

export type EnvConfig = {
  ETHERSCAN_API_KEY: string;
  GANACHE_PRIVATE_KEY: string;
  GANACHE_RPC_URL: string;
  GOERLI_RPC_URL: string;
  MAINNET_RPC_URL: string;
  MUMBAI_RPC_URL: string;
  POLYGON_RPC_URL: string;
  POLYSCAN_API_KEY: string;
  ACCOUNTS: string[];
};
