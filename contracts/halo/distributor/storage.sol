// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library DistributorStorage {
    struct Config {
        address timelockContract;
        address haloToken;
        address[] whitelist;
        uint spendLimit;
    }

    struct State {
        Config config;
    }
}

contract Storage {
    DistributorStorage.State state;
}
