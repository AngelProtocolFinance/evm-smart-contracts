// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract DummyERC165CompatibleContract is IERC165 {
  function supportsInterface(bytes4 interfaceId) external view returns (bool) {
    return type(IERC165).interfaceId == interfaceId;
  }
}
