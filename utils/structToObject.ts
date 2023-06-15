export function structToObject<T extends object>(struct: T): T {
  return (Object.keys(struct) as (keyof T)[])
    .filter((key) => isNaN(Number(key)))
    .reduce((res, key) => {
      res[key] = struct[key];
      return res;
    }, {} as T);
}
