// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccountMessages} from "../message.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";

/**
 * @title AccountsUpdateEndowmentSettingsController
 * @notice This contract facet is used to manage updates via the endowment settings controller
 * @dev This contract facet is used to manage updates via the endowment settings controller
 */
interface IAccountsUpdateEndowmentSettingsController {
  /**
   * @notice Updates an allowlist of an endowment, adding and/or removing addresses.
   * @dev Emits a EndowmentAllowlistUpdated event after the endowment has been updated.
   * @dev Throws an error if the endowment is closing.
   * @param id The ID of the endowment to updated
   * @param allowlistType AllowlistType to be updated
   * @param add The addresses to add to the allowlist
   * @param remove The addresses to remove from the allowlist
   */
  function updateEndowmentAllowlist(
    uint32 id,
    LibAccounts.AllowlistType allowlistType,
    address[] memory add,
    address[] memory remove
  ) external;

  /**
    @dev Updates the settings of an endowment.
    @param details Object containing the updated details of the endowment settings.
    @param details.id The ID of the endowment to update.
    @param details.splitToLiquid The updated split to liquid ratio.
    @param details.ignoreUserSplits Whether or not to ignore user splits.
    Emits a EndowmentSettingUpdated event for each setting that has been updated.
    Emits an UpdateEndowment event after the endowment has been updated.
    Throws an error if the endowment is closing.
    */
  function updateEndowmentSettings(
    AccountMessages.UpdateEndowmentSettingsRequest memory details
  ) external;

  /**
    @notice Updates the controller of the specified endowment
    @dev Only the endowment owner can call this function
    @param details The updated details of the endowment controller
    @param details.id The ID of the endowment
    */
  function updateEndowmentController(
    AccountMessages.UpdateEndowmentControllerRequest memory details
  ) external;

  /**
    @notice Allows the owner or DAO to update the fees for a given endowment.
    @dev Only the fees that the caller is authorized to update will be updated.
    @param details The details of the fee update request, including the endowment ID, new fees, and the caller's signature.
    @dev Emits an UpdateEndowment event containing the updated endowment details.
    @dev Reverts if the endowment is of type Charity, as charity endowments may not change fees.
    */
  function updateFeeSettings(AccountMessages.UpdateFeeSettingRequest memory details) external;
}
