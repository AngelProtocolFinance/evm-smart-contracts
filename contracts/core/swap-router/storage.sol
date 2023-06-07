// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library SwapRouterStorage {
    struct Config {
        address registrarContract;
        address accountsContract;
    }
}

contract Storage {
    uint24[] swappingFees;
    SwapRouterStorage.Config config;
    address swapRouter;
    address swapFactory;
    bool initSwapRouterFlag;
}
