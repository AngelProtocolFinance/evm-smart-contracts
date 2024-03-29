// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {AccountMessages} from "../message.sol";

interface IAccountsCreateEndowment {
  function createEndowment(
    AccountMessages.CreateEndowmentRequest memory details
  ) external returns (uint32);
}
