export class TwoWayMap {
  private map: Record<number, string>;
  private reverseMap: Record<string, number>;
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
  values() {
    return Object.values(this.map);
  }
}
