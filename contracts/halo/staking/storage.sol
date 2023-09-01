// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library StakingStorage {
  struct StakeInfo {
    bool started;
    uint256 startTime;
    uint256 endTime;
    uint256 amount;
    uint256 claimed;
  }

  struct Config {
    uint256 interestRate;
    uint256 stakePeriod;
  }

  struct State {
    mapping(address => mapping(uint256 => StakeInfo)) stakeInfos;
    mapping(address => uint256) stakeNumber;
    mapping(address => uint256) totalStakedFor;
    address haloToken;
    uint256 totalStaked;
    Config config;
  }
}

contract Storage {
  StakingStorage.State state;
}
