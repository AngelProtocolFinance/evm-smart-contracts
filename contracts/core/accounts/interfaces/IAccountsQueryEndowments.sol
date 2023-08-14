// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";
import {AccountStorage} from "../storage.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";

interface IAccountsQueryEndowments {
  function queryTokenAmount(
    uint32 id,
    IVault.VaultType accountType,
    address tokenaddress
  ) external view returns (uint256 tokenAmount);

  function queryEndowmentDetails(
    uint32 id
  ) external view returns (AccountMessages.EndowmentResponse memory);

  function queryConfig() external view returns (AccountMessages.ConfigResponse memory config);

  function queryState(
    uint32 id
  ) external view returns (AccountMessages.StateResponse memory stateResponse);
}
