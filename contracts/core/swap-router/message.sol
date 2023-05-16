// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library SwapRouterMessages {
    struct InstantiateMsg {
        address registrarContract;
        address accountsContract;
        address swapFactory;
        address swapRouter;
    }
}
