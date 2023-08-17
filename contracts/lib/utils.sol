// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/utils/Address.sol";

library Utils {
  function _execute(address target, uint256 value, bytes memory data) internal {
    string memory errorMessage = "call reverted without message";
    (bool success, bytes memory returndata) = target.call{value: value}(data);
    Address.verifyCallResult(success, returndata, errorMessage);
  }
}
