// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library StakingMessages {
  struct InstantiateMsg {
    address haloToken;
    uint256 interestRate;
    uint256 stakePeriod;
  }

  struct ConfigResponse {
    uint256 interestRate;
    uint256 stakePeriod;
  }
}
