// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library GovHodlerStorage {
  struct Config {
    address owner;
    address haloToken;
    address timelockContract;
  }

  struct State {
    Config config;
  }
}

contract Storage {
  GovHodlerStorage.State state;
}
