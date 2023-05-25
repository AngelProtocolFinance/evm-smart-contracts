// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library CollectorStorage {
    struct Config {
        address owner;
        address haloToken;
        address timelockContract;
        address govContract;
        address swapFactory;
        address distributorContract;
        uint256 rewardFactor; // 2 decimals
    }

    struct AssetInfo {
        string demo;
        address contractAddr;
    }
    enum assetInfo {
        Token,
        NativeToken
    }
    struct PairInfo {
        assetInfo enumType;
        AssetInfo enumData;
        address contractAddr;
        string liquidyToken;
        uint assetDecimals;
    }

    struct State {
        Config config;
    }
}

contract Storage {
    CollectorStorage.State state;
}
