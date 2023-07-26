// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library IterableMappingEndow {
  // Iterable mapping from uint32 (Endowment ID) to bool;
  struct Map {
    uint32[] keys;
    mapping(uint32 => bool) values;
    mapping(uint32 => uint) indexOf;
    mapping(uint32 => bool) inserted;
  }

  function get(Map storage map, uint32 key) public view returns (bool) {
    return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) public view returns (uint32) {
    return map.keys[index];
  }

  function size(Map storage map) public view returns (uint) {
    return map.keys.length;
  }

  function set(Map storage map, uint32 key, bool val) public {
    if (map.inserted[key]) {
      map.values[key] = val;
    } else {
      map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(Map storage map, uint32 key) public {
    if (!map.inserted[key]) {
      return;
    }

    delete map.inserted[key];
    delete map.values[key];

    uint index = map.indexOf[key];
    uint32 lastKey = map.keys[map.keys.length - 1];

    map.indexOf[lastKey] = index;
    delete map.indexOf[key];

    map.keys[index] = lastKey;
    map.keys.pop();
  }
}

library IterableMappingFund {
  // Iterable mapping from uint256 (FundID) to bool;
  struct Map {
    uint256[] keys;
    mapping(uint256 => bool) values;
    mapping(uint256 => uint) indexOf;
    mapping(uint256 => bool) inserted;
  }

  function get(Map storage map, uint256 key) public view returns (bool) {
    return map.values[key];
  }

  function getKeyAtIndex(Map storage map, uint index) public view returns (uint256) {
    return map.keys[index];
  }

  function size(Map storage map) public view returns (uint) {
    return map.keys.length;
  }

  function set(Map storage map, uint256 key, bool val) public {
    if (map.inserted[key]) {
      map.values[key] = val;
    } else {
      map.inserted[key] = true;
      map.values[key] = val;
      map.indexOf[key] = map.keys.length;
      map.keys.push(key);
    }
  }

  function remove(Map storage map, uint256 key) public {
    if (!map.inserted[key]) {
      return;
    }

    delete map.inserted[key];
    delete map.values[key];

    uint index = map.indexOf[key];
    uint256 lastKey = map.keys[map.keys.length - 1];

    map.indexOf[lastKey] = index;
    delete map.indexOf[key];

    map.keys[index] = lastKey;
    map.keys.pop();
  }
}
