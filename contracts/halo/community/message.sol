// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CommunityMessage {
    struct InstantiateMsg {
        address timelockContract;
        address haloToken;
        uint spendLimit;
    }

    struct ConfigResponse {
        address timelockContract;
        address haloToken;
        uint spendLimit;
    }
}
