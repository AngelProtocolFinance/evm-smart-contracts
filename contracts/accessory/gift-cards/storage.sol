// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {AngelCoreStruct} from "../../core/struct.sol";

library GiftCardsStorage {
    struct Config {
        address owner;
        address registrarContract;
        address keeper;
        uint256 nextDeposit;
    }

    struct Deposit {
        address sender;
        AngelCoreStruct.AssetBase token;
        bool claimed;
    }

    struct State {
        Config config;
        mapping(uint256 => Deposit) DEPOSITS;
        mapping(address => AngelCoreStruct.GenericBalance) BALANCES;
    }
}

contract Storage {
    GiftCardsStorage.State state;
}
