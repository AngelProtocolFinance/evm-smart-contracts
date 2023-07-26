import fs from "fs";

import {VaultType, StrategyObject} from "./types";
import {readStrategyAddresses} from "./helpers";
import {DEFAULT_STRATEGY_ADDRESSES_FILE_PATH} from "..";

export function getVaultAddress(name: string, type: VaultType): string {
  let typeName: string;
  if (type == VaultType.LOCKED) {
    typeName = "locked";
  } else if (type == VaultType.LIQUID) {
    typeName = "liquid";
  } else {
    throw new Error(`Vault of type ${type} is not`);
  }
  const addresses = readStrategyAddresses(DEFAULT_STRATEGY_ADDRESSES_FILE_PATH, name);

  return addresses[typeName as keyof StrategyObject];
}

export function getStrategyAddress(name: string): string {
  const addresses = readStrategyAddresses(DEFAULT_STRATEGY_ADDRESSES_FILE_PATH, name);

  return addresses["strategy"];
}

export function writeStrategyAddresses(name: string, data: StrategyObject, filepath?: string) {
  const fp = filepath ? filepath : DEFAULT_STRATEGY_ADDRESSES_FILE_PATH;
  const jsonData = fs.readFileSync(fp, "utf-8");
  const allData: Record<string, StrategyObject> = JSON.parse(jsonData);
  allData[name] = data;
  fs.writeFileSync(fp, JSON.stringify(allData));
}
