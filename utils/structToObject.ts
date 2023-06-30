export function structToObject<T>(struct: T): T {
  if (!struct || typeof struct !== "object") {
    return struct;
  }
  return (Object.keys(struct) as (keyof T)[])
    .filter((key) => isNaN(Number(key)))
    .reduce((res, key) => {
      res[key] = structToObject(struct[key]);
      return res;
    }, {} as T);
}
