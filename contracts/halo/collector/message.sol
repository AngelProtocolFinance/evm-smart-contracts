// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CollectorMessage {
    struct InstantiateMsg {
        address registrarContract;
        address timelockContract;
        address govContract;
        address swapFactory;
        address haloToken;
        address distributorContract;
        uint256 rewardFactor; // 2 decimals
    }
    struct ConfigResponse {
        address owner;
        address registrarContract;
        address haloToken;
        address govContract;
        address timelockContract;
        address swapFactory;
        address distributorContract;
        uint256 rewardFactor; // 2 decimals
    }
}
