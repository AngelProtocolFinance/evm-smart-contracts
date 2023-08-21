// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

  /**
   * @notice This function updates the DAF Approved Endowments mapping. If and endowment is passed in both lists it will result in removal/unapproved state.
   * @dev This function updates the DAF Approved Endowments mapping. If and endowment is passed in both lists it will result in removal/unapproved state.
   * @param add Endowments list to add/approve for DAF Withdrawals
   * @param remove Endowments list to remove/reject for DAF Withdrawals
   */
  function updateDafApprovedEndowments(uint32[] memory add, uint32[] memory remove) external;
}
