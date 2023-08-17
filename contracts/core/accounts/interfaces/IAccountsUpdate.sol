// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {LibAccounts} from "../lib/LibAccounts.sol";

/**
 * @title AccountsUpdate
 * @notice This contract facet updates the accounts config and owner
 * @dev This contract facet updates the accounts config and owner
 */
interface IAccountsUpdate {
  /**
   * @notice This function updates the owner of the contract
   * @dev This function updates the owner of the contract
   * @param newOwner The new owner of the contract
   */
  function updateOwner(address newOwner) external;

  /**
   * @notice This function updates the config of the contract
   * @dev This function updates the config of the contract
   * @param newRegistrar The new registrar contract
   */
  function updateConfig(address newRegistrar) external;
}
