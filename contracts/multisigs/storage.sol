// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library MultiSigStorage {
  struct Transaction {
    string title;
    string description;
    address destination;
    uint256 value;
    bytes data;
    bool executed;
    bytes metadata;
  }
}

contract StorageMultiSig {
  /*
   *  Storage
   */
  mapping(uint256 => MultiSigStorage.Transaction) public transactions;
  mapping(uint256 => mapping(address => bool)) public confirmations;
  mapping(address => bool) public isOwner;
  address[] public owners;
  uint256 public required;
  uint256 public transactionCount;
  bool public requireExecution;
}
