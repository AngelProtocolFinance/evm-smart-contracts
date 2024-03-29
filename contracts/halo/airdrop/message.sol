// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library AirdropMessage {
  struct InstantiateMsg {
    address haloToken;
  }
  struct MerkleRootResponse {
    uint256 stage;
    bytes32 merkleRoot;
  }
}
