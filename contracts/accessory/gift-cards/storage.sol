// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library GiftCardsStorage {
  struct Config {
    address owner;
    address registrarContract;
    address keeper;
    uint256 nextDeposit;
  }

  struct Deposit {
    address sender;
    address tokenAddress;
    uint256 amount;
    bool claimed;
  }

  struct State {
    Config config;
    mapping(uint256 => Deposit) DEPOSITS;
    mapping(address => mapping(address => uint256)) BALANCES;
  }
}

contract Storage {
  GiftCardsStorage.State state;
}
