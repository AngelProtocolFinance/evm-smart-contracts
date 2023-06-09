// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {MultiSigStorage} from "../../../multisigs/storage.sol";

interface IEndowmentMultiSigEmitter {
  function confirmEndowment(uint256 endowmentId, address sender, uint256 transactionId) external;

  function revokeEndowment(uint256 endowmentId, address sender, uint256 transactionId) external;

  function submitEndowment(
    uint256 endowmentId,
    uint256 transactionId,
    MultiSigStorage.Transaction memory transaction
  ) external;

  function executeEndowment(uint256 endowmentId, uint256 transactionId) external;

  function executeFailureEndowment(uint256 endowmentId, uint256 transactionId) external;

  function depositEndowment(uint256 endowmentId, address sender, uint256 value) external;

  function addOwnerEndowment(uint256 endowmentId, address owner) external;

  function removeOwnerEndowment(uint256 endowmentId, address owner) external;

  function requirementChangeEndowment(uint256 endowmentId, uint256 required) external;

  function createMultisig(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] memory owners,
    uint256 required,
    bool requireexecution
  ) external;
}
