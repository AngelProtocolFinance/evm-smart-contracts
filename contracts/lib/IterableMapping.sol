// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract IterableMapping {
  struct Map {
    uint256[] keys;
    mapping(uint256 => bool) values;
    mapping(uint256 => uint) indexOf;
    mapping(uint256 => bool) inserted;
  }

  function get(Map storage map, uint256 key) internal view returns (bool) {
    return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) internal view returns (uint256) {
    return map.keys[index];
  }

  function size(Map storage map) internal view returns (uint) {
    return map.keys.length;
  }

  function set(Map storage map, uint256 key, bool val) internal {
    if (map.inserted[key]) {
      map.values[key] = val;
    } else {
      map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(Map storage map, uint256 key) internal {
    if (!map.inserted[key]) {
      return;
    }

    delete map.inserted[key];
    delete map.values[key];

    uint256 index = map.indexOf[key];
    uint256 lastKey = map.keys[map.keys.length - 1];

    map.indexOf[lastKey] = index;
    delete map.indexOf[key];

    map.keys[index] = lastKey;
    map.keys.pop();
  }
}
