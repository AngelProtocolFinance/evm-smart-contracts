// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library MultiSigStorage {
  struct Confirmations {
    mapping(address => bool) confirmationsByOwner;
    uint256 count;
  }

  struct Transaction {
    address destination;
    uint256 value;
    bytes data;
    bool executed;
    uint256 expiry;
    bytes metadata;
  }
}

contract StorageMultiSig {
  mapping(uint256 => MultiSigStorage.Transaction) public transactions;
  mapping(uint256 => MultiSigStorage.Confirmations) public confirmations;
  mapping(address => bool) public isOwner;
  uint256 public transactionExpiry;
  uint256 public activeOwnersCount;
  uint256 public approvalsRequired;
  uint256 public transactionCount;
  bool public requireExecution;
}
