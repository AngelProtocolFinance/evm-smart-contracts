// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../lib/LibAccounts.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
interface IAccountsUpdateStatusEndowments {
  /**
   * @notice Closes an endowment, setting the endowment state to "closingEndowment" and the closing beneficiary to the provided beneficiary.
   * @param id The ID of the endowment to be closed.
   * @param beneficiary The beneficiary that will receive any remaining funds in the endowment.
   * @dev The function will revert if a redemption is rently in progress.
   * @dev Emits an `UpdateEndowmentState` event with the updated state of the endowment.
   */
  function closeEndowment(uint32 id, LibAccounts.Beneficiary memory beneficiary) external;
}
