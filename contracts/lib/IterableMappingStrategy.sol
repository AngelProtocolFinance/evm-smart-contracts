// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IterableMappingStrategy {
  struct StratMap {
    bytes4[] keys;
    mapping(bytes4 => bool) values;
    mapping(bytes4 => uint) indexOf;
    mapping(bytes4 => bool) inserted;
  }

  function get(StratMap storage map, bytes4 key) internal view returns (bool) {
    return map.values[key];
  }

  function getKeyAtIndex(StratMap storage map, uint index) internal view returns (bytes4) {
    return map.keys[index];
  }

  function size(StratMap storage map) internal view returns (uint) {
    return map.keys.length;
  }

  function set(StratMap storage map, bytes4 key, bool val) internal {
    if (map.inserted[key]) {
      map.values[key] = val;
    } else {
      map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(StratMap storage map, bytes4 key) internal {
    if (!map.inserted[key]) {
      return;
    }

    delete map.inserted[key];
    delete map.values[key];

    uint index = map.indexOf[key];
    bytes4 lastKey = map.keys[map.keys.length - 1];

    map.indexOf[lastKey] = index;
    delete map.indexOf[key];

    map.keys[index] = lastKey;
    map.keys.pop();
  }
}
