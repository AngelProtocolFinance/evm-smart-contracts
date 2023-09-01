// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library VestingMessages {
  struct InstantiateMsg {
    uint256 vestingDuration;
    uint256 vestingSlope; // 2 decimals
    address haloToken;
  }

  struct StateResponse {
    address haloToken;
    uint256 genesisTime;
    uint256 totalVesting;
  }

  struct ConfigResponse {
    uint256 vestingDuration;
    uint256 vestingSlope; // 2 decimals
  }
}
