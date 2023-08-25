// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {MultiSigGeneric} from "./MultiSigGeneric.sol";

contract APTeamMultiSig is MultiSigGeneric {
  /// @dev Initializes MultiSig's state variables.
  /// @param owners List of initial owners.
  /// @param _approvalsRequired Number of required confirmations.
  /// @param _requireExecution setting for if an explicit execution call is required
  /// @param _transactionExpiry Proposal expiry time in seconds
  function initializeAPTeam(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) public initializer {
    super.initialize(owners, _approvalsRequired, _requireExecution, _transactionExpiry);
  }
}
