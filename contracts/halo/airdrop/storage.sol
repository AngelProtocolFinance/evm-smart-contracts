// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library AirdropStorage {
  struct State {
    mapping(uint256 => bytes32) MerkleRoots;
    mapping(uint256 => mapping(address => bool)) Claims;
    address haloToken;
    uint256 latestStage;
  }
}

contract Storage {
  AirdropStorage.State state;
}
