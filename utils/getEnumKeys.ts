export function getEnumKeys<T extends {[key: string]: string | number}>(enumValue: T): (keyof T)[] {
  return Object.keys(enumValue).filter((key) => isNaN(Number(enumValue[key])));
}
