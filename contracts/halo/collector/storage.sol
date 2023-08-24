// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CollectorStorage {
  struct Config {
    address registrarContract;
    uint256 rewardFactor;
    uint256 slippage;
  }

  struct State {
    Config config;
  }
}

contract Storage {
  CollectorStorage.State state;
}
