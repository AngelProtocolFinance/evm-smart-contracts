import fs from "fs";

import {StrategyObject} from "./types";

export function readStrategyAddresses(filePath: string, name: string): StrategyObject {
  checkExistence(filePath);

  const jsonData = fs.readFileSync(filePath, "utf-8");

  const allData: Record<string, StrategyObject> = JSON.parse(jsonData);

  return allData[name];
}

function checkExistence(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`No such file, path: '${filePath}'.`);
  }
}
