// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISubDaoToken {
  function executeDonorMatch(
    uint256 amount,
    address accountscontract,
    uint32 endowmentid,
    address donor
  ) external;
}
