// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract IterableMappingAddr {
  error NonExistentKey(address key);
  error DecrAmountExceedsValue(address key, uint256 currVal, uint256 decrVal);

  struct Map {
    address[] keys;
    mapping(address => bool) values;
    mapping(address => uint) indexOf;
    mapping(address => bool) inserted;
  }

  function get(Map storage map, address key) internal view returns (bool) {
    return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) internal view returns (address) {
    return map.keys[index];
  }

  function size(Map storage map) internal view returns (uint) {
    return map.keys.length;
  }

  function set(Map storage map, address key, bool val) internal {
    if (map.inserted[key]) {
      map.values[key] = val;
    } else {
      map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(Map storage map, address key) internal {
    if (!map.inserted[key]) {
      return;
    }

    delete map.inserted[key];
    delete map.values[key];

    uint256 index = map.indexOf[key];
    address lastKey = map.keys[map.keys.length - 1];

    map.indexOf[lastKey] = index;
    delete map.indexOf[key];

    map.keys[index] = lastKey;
    map.keys.pop();
  }
}
