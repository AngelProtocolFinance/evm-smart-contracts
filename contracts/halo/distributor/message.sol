// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library DistributorMessage {
    struct InstantiateMsg {
        address timelockContract;
        address haloToken;
        address[] whitelist;
        uint spendLimit;
    }

    struct ConfigResponse {
        address timelockContract;
        address haloToken;
        address[] whitelist;
        uint spendLimit;
    }
}
