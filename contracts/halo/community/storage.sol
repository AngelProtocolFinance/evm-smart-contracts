// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CommunityStorage {
  struct Config {
    address haloToken;
    uint spendLimit;
  }

  struct State {
    Config config;
  }
}

contract Storage {
  CommunityStorage.State state;
}
