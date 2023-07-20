import fs from "fs";

import {StrategyObject} from "./types";

export function readStrategyAddresses(
  filePath: string,
  name: string
): Record<string, StrategyObject> {
  checkExistence(filePath);

  const jsonData = fs.readFileSync(filePath, "utf-8");

  const allData = JSON.parse(jsonData);

  const data: Record<string, StrategyObject> = allData[name];

  return data;
}

function checkExistence(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`No such file, path: '${filePath}'.`);
  }
}
