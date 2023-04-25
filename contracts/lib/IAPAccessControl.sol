// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

interface IAPAccessControl {
  function isAuthorized(address operator) external returns (bool);
}