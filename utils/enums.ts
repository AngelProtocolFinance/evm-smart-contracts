export function getEnumKeys<T extends {[key: string]: string | number}>(enumValue: T): (keyof T)[] {
  return Object.keys(enumValue).filter((key) => isNaN(Number(enumValue[key])));
}

export function getEnumValuesAsString<T extends {[key: string]: string | number}>(
  enumValue: T
): string {
  return getEnumKeys(enumValue)
    .map((key) => `${String(key)} - ${enumValue[key]}`)
    .join(", ");
}
