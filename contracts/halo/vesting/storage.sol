// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library VestingStorage {
  struct VestingInfo {
    uint256 amount;
    uint256 startTime;
    uint256 endTime;
    uint256 claimed;
  }

  struct Config {
    uint256 vestingDuration;
    uint256 vestingSlope; // 2 decimals
  }

  struct State {
    mapping(address => mapping(uint256 => VestingInfo)) Vestings;
    mapping(address => uint256) VestingNumber;
    address haloToken;
    uint256 genesisTime;
    uint256 totalVesting;
    Config config;
  }
}

contract Storage {
  VestingStorage.State state;
}
