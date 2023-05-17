// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";

interface IAccountsCreateEndowment {
    function createEndowment(
        AccountMessages.CreateEndowmentRequest memory curDetails
    ) external returns (uint32);
}
