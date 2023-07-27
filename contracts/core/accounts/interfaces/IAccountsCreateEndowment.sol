// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";

interface IAccountsCreateEndowment {
  function get() external returns (uint32);

  function createEndowment(
    AccountMessages.CreateEndowmentRequest memory details
  ) external returns (uint32);
}
