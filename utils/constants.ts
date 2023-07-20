import path from "path";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const DEFAULT_CONTRACT_ADDRESS_FILE_PATH = path.join(__dirname, "../contract-address.json");

export const DEFAULT_STRATEGY_ADDRESSES_FILE_PATH = path.join(
  __dirname,
  "../contracts/integrations/strategy-addresses.json"
);
