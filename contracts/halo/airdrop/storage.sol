// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// import {AngelCoreStruct} from "../../core/struct.sol";

// import {MultiSigStruct} from "../struct.sol";

library AirdropStorage {
    struct Config {
        address owner;
        address haloToken;
    }
    struct State {
        Config config;
        uint256 latestStage;
        mapping(uint256 => bytes32) MerkleRoots;
        mapping(uint256 => mapping(address => bool)) isClaimed;
        mapping(uint256 => address[]) claimed;
    }
}

contract Storage {
    AirdropStorage.State state;
}
