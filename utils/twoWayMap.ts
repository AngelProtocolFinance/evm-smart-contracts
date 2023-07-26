export class TwoWayMap {
  map: Record<number, string>;
  reverseMap: Record<string, number>;
  constructor(map: Record<number, string>) {
    this.map = map;
    this.reverseMap = {};
    for (const key in map) {
      const value: any = map[key];
      this.reverseMap[value] = Number(key);
    }
  }
  get(key: any) {
    return this.map[key];
  }
  revGet(key: any) {
    return this.reverseMap[key];
  }
}
