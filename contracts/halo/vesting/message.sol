// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library VestingMessage {
    struct InstantiateMsg {
        address haloToken;
    }

    struct ConfigResponse {
        address owner;
        uint256 genesisTime;
    }
}
