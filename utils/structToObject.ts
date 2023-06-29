export function structToObject<T extends object>(struct: T): T {
  return (Object.keys(struct) as (keyof T)[])
    .filter((key) => isNaN(Number(key)))
    .reduce((res, key) => {
      const value = struct[key];
      if (typeof value === "object") {
        res[key] = structToObject(value);
      } else {
        res[key] = value;
      }
      return res;
    }, {} as T);
}
