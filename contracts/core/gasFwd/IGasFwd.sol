// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IGasFwd {
  function payForGas(address token, uint256 amount) external returns (uint256);

  function sweep(address token) external returns (uint256);
}
