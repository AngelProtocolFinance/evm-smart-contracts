// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IEndowmentMultiSigEmitter {
  function transactionConfirmedEndowment(
    uint256 endowmentId,
    address owner,
    uint256 transactionId
  ) external;

  function transactionConfirmationRevokedEndowment(
    uint256 endowmentId,
    address owner,
    uint256 transactionId
  ) external;

  function transactionConfirmationOfFormerOwnerRevokedEndowment(
    uint256 endowmentId,
    address formerOwner,
    uint256 transactionId
  ) external;

  function transactionSubmittedEndowment(
    uint256 endowmentId,
    address owner,
    uint256 transactionId
  ) external;

  function transactionExecutedEndowment(uint256 endowmentId, uint256 transactionId) external;

  function ownersAddedEndowment(uint256 endowmentId, address[] memory owners) external;

  function ownersRemovedEndowment(uint256 endowmentId, address[] memory owners) external;

  function ownerReplacedEndowment(
    uint256 endowmentId,
    address currOwner,
    address newOwner
  ) external;

  function approvalsRequirementChangedEndowment(
    uint256 endowmentId,
    uint256 approvalsRequired
  ) external;

  function requireExecutionChangedEndowment(uint256 endowmentId, bool requireExecution) external;

  function expiryChangedEndowment(uint256 endowmentId, uint256 transactionExpiry) external;

  function createEndowmentMultisig(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] memory owners,
    uint256 required,
    bool requireExecution,
    uint256 transactionExpiry
  ) external;
}
