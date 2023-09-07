import {getKeysTyped} from "./getKeysTyped";

export function structToObject<T>(struct: T): T {
  if (!struct || typeof struct !== "object") {
    return struct;
  }
  return getKeysTyped(struct)
    .filter((key) => isNaN(Number(key)))
    .reduce((res, key) => {
      res[key] = structToObject(struct[key]);
      return res;
    }, {} as T);
}
