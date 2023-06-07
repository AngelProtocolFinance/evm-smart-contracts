// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library Validator {
  function addressChecker(address addr1) internal pure returns (bool) {
    if (addr1 == address(0)) {
      return false;
    }
    return true;
  }
}
