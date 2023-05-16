// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Address.sol";

library Utils {
    function _execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas
    ) internal {
        string memory errorMessage = "call reverted without message";
        for (uint256 i = 0; i < targets.length; ++i) {
            (bool success, bytes memory returndata) = targets[i].call{
                value: values[i]
            }(calldatas[i]);
            Address.verifyCallResult(success, returndata, errorMessage);
        }
    }
    function _execute(
        address target,
        uint256 value,
        bytes memory data
    ) internal {
        string memory errorMessage = "call reverted without message";
        (bool success, bytes memory returndata) = 
            target.call
            {value: value}
            (data);
        Address.verifyCallResult(success, returndata, errorMessage);
    }
}
