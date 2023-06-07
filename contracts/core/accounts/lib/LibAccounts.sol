// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountStorage} from "../storage.sol";

library LibAccounts {
    bytes32 constant AP_ACCOUNTS_DIAMOND_STORAGE_POSITION =
        keccak256("accounts.diamond.storage");

    function diamondStorage()
        internal
        pure
        returns (AccountStorage.State storage ds)
    {
        bytes32 position = AP_ACCOUNTS_DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}
