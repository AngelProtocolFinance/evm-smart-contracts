// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library GiftCardsMessage {
  struct InstantiateMsg {
    address keeper;
    address registrarContract;
  }
}
