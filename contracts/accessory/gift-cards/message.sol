// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library GiftCardsMessage {
  struct InstantiateMsg {
    address keeper;
    address registrarContract;
  }
}
