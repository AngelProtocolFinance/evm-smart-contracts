// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {MultiSigGeneric} from "./MultiSigGeneric.sol";

contract APTeamMultiSig is MultiSigGeneric {
  function initializeAPTeam(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) public initializer {
    super.initialize(owners, _approvalsRequired, _requireExecution, _transactionExpiry);
  }
}
