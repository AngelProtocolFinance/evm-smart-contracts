// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IEndowmentMultiSigEmitter {
  function confirmEndowment(uint256 endowmentId, address sender, uint256 transactionId) external;

  function revokeEndowment(uint256 endowmentId, address sender, uint256 transactionId) external;

  function submitEndowment(uint256 endowmentId, uint256 transactionId) external;

  function executeEndowment(uint256 endowmentId, uint256 transactionId) external;

  function executeFailureEndowment(uint256 endowmentId, uint256 transactionId) external;

  function depositEndowment(uint256 endowmentId, address sender, uint256 value) external;

  function addOwnersEndowment(uint256 endowmentId, address[] memory owners) external;

  function removeOwnersEndowment(uint256 endowmentId, address[] memory owners) external;

  function replaceOwnerEndowment(uint256 endowmentId, address currOwner, address newOwner) external;

  function approvalsRequirementChangeEndowment(
    uint256 endowmentId,
    uint256 approvalsRequired
  ) external;

  function requireExecutionChangeEndowment(uint256 endowmentId, bool requireExecution) external;

  function transactionExpiryChangeEndowment(uint256 endowmentId, uint256 transactionExpiry) external;

  function createMultisig(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] memory owners,
    uint256 required,
    bool requireExecution,
    uint256 transactionExpiry
  ) external;
}
