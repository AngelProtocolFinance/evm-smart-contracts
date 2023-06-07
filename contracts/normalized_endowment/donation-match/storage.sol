// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library DonationMatchStorage {
    struct Config {
        address reserveToken;
        address uniswapFactory;
        address usdcAddress;
        address registrarContract;
        uint24 poolFee;
    }

    struct State {
        Config config;
    }
}

contract Storage {
    DonationMatchStorage.State state;
}
