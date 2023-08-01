// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IAccountsGasManager {
  error OnlyAccountsContract();
  error OnlyAdmin();
  function sweepForClosure(uint32 id, address token) external returns (uint256);
  function sweepForEndowment(uint32 id, address token) external returns (uint256);
}
