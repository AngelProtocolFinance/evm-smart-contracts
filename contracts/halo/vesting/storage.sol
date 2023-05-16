// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library VestingStorage {
    struct Config {
        address owner;
        uint genesisTime;
        address haloToken;
    }

    struct State {
        Config config;
    }
}

contract Storage {
    VestingStorage.State state;
}
