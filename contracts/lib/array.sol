// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Array {
  function quickSort(uint256[] memory arr, int256 left, int256 right) internal pure {
    int256 i = left;
    int256 j = right;
    if (i == j) return;
    uint256 pivot = arr[uint256(left + (right - left) / 2)];
    while (i <= j) {
      while (arr[uint256(i)] < pivot) i++;
      while (pivot < arr[uint256(j)]) j--;
      if (i <= j) {
        (arr[uint256(i)], arr[uint256(j)]) = (arr[uint256(j)], arr[uint256(i)]);
        i++;
        j--;
      }
    }
    if (left < j) quickSort(arr, left, j);
    if (i < right) quickSort(arr, i, right);
  }

  function sort(uint256[] memory data) internal pure returns (uint256[] memory) {
    quickSort(data, int256(0), int256(data.length - 1));
    return data;
  }

  function max(uint256[] memory data) internal pure returns (uint256) {
    uint256 maxVal = data[0];
    for (uint256 i = 1; i < data.length; i++) {
      if (maxVal < data[i]) {
        maxVal = data[i];
      }
    }

    return maxVal;
  }

  // function min(uint256[] memory data) internal pure returns (uint256) {
  //     uint256 min = data[0];
  //     for (uint256 i = 1; i < data.length; i++) {
  //         if (min > data[i]) {
  //             min = data[i];
  //         }
  //     }

  //     return min;
  // }

  function indexOf(uint256[] memory arr, uint256 searchFor) internal pure returns (uint256, bool) {
    for (uint256 i = 0; i < arr.length; i++) {
      if (arr[i] == searchFor) {
        return (i, true);
      }
    }
    // not found
    return (0, false);
  }

  function remove(uint256[] storage data, uint256 index) internal returns (uint256[] memory) {
    if (index >= data.length) {
      revert("Error in remove: internal");
    }

    for (uint256 i = index; i < data.length - 1; i++) {
      data[i] = data[i + 1];
    }
    data.pop();
    return data;
  }
}

library Array32 {
  function indexOf(uint32[] memory arr, uint32 searchFor) internal pure returns (uint32, bool) {
    for (uint32 i = 0; i < arr.length; i++) {
      if (arr[i] == searchFor) {
        return (i, true);
      }
    }
    // not found
    return (0, false);
  }

  function remove(uint32[] storage data, uint32 index) internal returns (uint32[] memory) {
    if (index >= data.length) {
      revert("Error in remove: internal");
    }

    for (uint32 i = index; i < data.length - 1; i++) {
      data[i] = data[i + 1];
    }
    data.pop();
    return data;
  }
}
