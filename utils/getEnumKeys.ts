export function getEnumKeys<T extends {[key: string]: string | number}>(enumValue: T) {
  return Object.keys(enumValue).filter((key) => isNaN(Number(enumValue[key])));
}
