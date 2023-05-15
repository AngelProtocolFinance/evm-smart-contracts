// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library LockedWithdrawStorage {
    struct Withdraw {
        bool pending;
        address[] tokenAddress;
        uint256[] amount;
    }

    struct Config {
        address registrar;
        address accounts;
        address apTeamMultisig;
        address endowFactory;
    }
}

contract Storage {
    LockedWithdrawStorage.Config config;
    mapping(uint256 => LockedWithdrawStorage.Withdraw) withdrawData;
}
