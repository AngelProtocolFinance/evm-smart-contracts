// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library AddressArray {
  function indexOf(address[] memory arr, address searchFor) internal pure returns (uint256, bool) {
    for (uint256 i = 0; i < arr.length; i++) {
      if (arr[i] == searchFor) {
        return (i, true);
      }
    }
    // not found
    return (0, false);
  }

  function remove(address[] storage data, uint256 index) internal returns (address[] memory) {
    if (index >= data.length) {
      revert("Error in remove: internal");
    }

    for (uint256 i = index; i < data.length - 1; i++) {
      data[i] = data[i + 1];
    }
    data.pop();
    return data;
  }

  function contains(address[] memory self, address addr) public pure returns (bool found) {
    (, found) = indexOf(self, addr);
  }
}
