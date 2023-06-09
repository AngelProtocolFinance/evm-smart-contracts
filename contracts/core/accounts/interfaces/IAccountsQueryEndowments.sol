// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";
import {AccountStorage} from "../storage.sol";
import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsQueryEndowments {
  function queryTokenAmount(
    uint256 id,
    AngelCoreStruct.AccountType accountType,
    address tokenaddress
  ) external view returns (uint256 tokenAmount);

  function queryEndowmentDetails(
    uint256 id
  ) external view returns (AccountStorage.Endowment memory endowment);

  function queryConfig() external view returns (AccountMessages.ConfigResponse memory config);

  function queryState(
    uint256 id
  ) external view returns (AccountMessages.StateResponse memory stateResponse);
}
