// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library GiftCardsMessage {
    struct InstantiateMsg {
        address keeper;
        address registrarContract;
    }
}
