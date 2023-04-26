// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library GovHodlerMessage {
    struct InstantiateMsg {
        address owner;
        address haloToken;
        address timelockContract;
    }
}
