// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CollectorMessage {
  struct InstantiateMsg {
    address registrarContract;
    uint256 rewardFactor;
    uint256 slippage;
  }

  struct ConfigResponse {
    address registrarContract;
    uint256 rewardFactor;
    uint256 slippage;
  }
}
