// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsUpdate
 * @notice This contract facet updates the accounts config and owner
 * @dev This contract facet updates the accounts config and owner
 */
contract AccountsUpdate is ReentrancyGuardFacet, AccountsEvents {
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

    emit UpdateConfig();
  }

  /**
   * @notice This function updates the config of the contract
   * @dev This function updates the config of the contract
   * @param newRegistrar The new registrar contract
   * @param maxGeneralCategoryId The max general category id
   */
  function updateConfig(
    address newRegistrar,
    uint256 maxGeneralCategoryId,
    AngelCoreStruct.FeeSetting memory earlyLockedWithdrawFee
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    require(msg.sender == state.config.owner, "Unauthorized");
    require(Validator.addressChecker(newRegistrar), "invalid registrar address");

    state.config.registrarContract = newRegistrar;
    state.config.maxGeneralCategoryId = maxGeneralCategoryId;
    state.config.earlyLockedWithdrawFee = earlyLockedWithdrawFee;

    emit UpdateConfig();
  }
}
