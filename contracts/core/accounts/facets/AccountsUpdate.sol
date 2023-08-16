// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../../validator.sol";
import {AccountStorage} from "../storage.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsUpdate} from "../interfaces/IAccountsUpdate.sol";

/**
 * @title AccountsUpdate
 * @notice This contract facet updates the accounts config and owner
 * @dev This contract facet updates the accounts config and owner
 */
contract AccountsUpdate is ReentrancyGuardFacet, IAccountsEvents, IAccountsUpdate {
  /**
   * @notice This function updates the owner of the contract
   * @dev This function updates the owner of the contract
   * @param newOwner The new owner of the contract
   */
  function updateOwner(address newOwner) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(msg.sender == state.config.owner, "Unauthorized");

    require(Validator.addressChecker(newOwner), "Enter a valid owner address");

    state.config.owner = newOwner;

    emit OwnerUpdated(newOwner);
  }

  /**
   * @notice This function updates the config of the contract
   * @dev This function updates the config of the contract
   * @param newRegistrar The new registrar contract
   */
  function updateConfig(address newRegistrar) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    require(msg.sender == state.config.owner, "Unauthorized");
    require(Validator.addressChecker(newRegistrar), "invalid registrar address");

    state.config.registrarContract = newRegistrar;

    emit ConfigUpdated();
  }

  /**
   * @notice This function updates the DAF Approved Endowments mapping. If an endowment is passed in both lists it will result in removal/unapproved state.
   * @dev This function updates the DAF Approved Endowments mapping. If an endowment is passed in both lists it will result in removal/unapproved state.
   * @param add Endowments list to add/approve for DAF Withdrawals
   * @param remove Endowments list to remove/reject for DAF Withdrawals
   */
  function updateDafApprovedEndowments(
    uint32[] memory add,
    uint32[] memory remove
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    require(msg.sender == state.config.owner, "Unauthorized");
    require(add.length > 0 || remove.length > 0, "Must pass at least one endowment to add/remove");

    // add all endowments first
    for (uint256 i = 0; i < add.length; i++) {
      state.DafApprovedEndowments[add[i]] = true;
    }

    // remove endowments
    for (uint256 i = 0; i < remove.length; i++) {
      state.DafApprovedEndowments[remove[i]] = false;
    }

    emit DafApprovedEndowmentsUpdated(add, remove);
  }
}
