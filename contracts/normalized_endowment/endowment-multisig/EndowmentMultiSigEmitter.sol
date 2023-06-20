// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {MultiSigGeneric} from "../../multisigs/MultiSigGeneric.sol";
import {MultiSigStorage} from "../../multisigs/storage.sol";

/**
 * @notice the endowment multisig emitter contract
 * @dev the endowment multisig emitter contract is a contract that emits events for all the endowment multisigs across AP
 */
contract EndowmentMultiSigEmitter {
  /*
   * Events
   */

  bool isInitialized;
  address multisigFactory;
  mapping(address => bool) isMultisig;

  function initEndowmentMultiSigEmitter(address _multisigFactory) public {
    require(_multisigFactory != address(0), "Invalid Address");
    require(!isInitialized, "Already initialized");
    isInitialized = true;
    multisigFactory = _multisigFactory;
  }

  modifier isEmitter() {
    require(isMultisig[msg.sender], "Unauthorized");
    _;
  }
  modifier isOwner() {
    require(msg.sender == multisigFactory, "Not multisig factory");
    _;
  }
  event MultisigCreated(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] owners,
    uint256 required,
    bool requireExecution
  );
  event EndowmentConfirmation(uint256 endowmentId, address sender, uint256 transactionId);
  event EndowmentRevocation(uint256 endowmentId, address sender, uint256 transactionId);
  event EndowmentSubmission(
    uint256 endowmentId,
    uint256 transactionId,
    MultiSigStorage.Transaction transaction
  );
  event EndowmentExecution(uint256 endowmentId, uint256 transactionId);
  event EndowmentExecutionFailure(uint256 endowmentId, uint256 transactionId);
  event EndowmentDeposit(uint256 endowmentId, address sender, uint256 value);
  event EndowmentOwnersAddition(uint256 endowmentId, address[] owners);
  event EndowmentOwnersRemoval(uint256 endowmentId, address[] owners);
  event EndowmentOwnerReplace(uint256 endowmentId, address currOwner, address newOwner);
  event EndowmentApprovalsRequirementChange(uint256 endowmentId, uint256 approvalsRequired);

  /**
   * @notice emits MultisigCreated event
   * @param multisigAddress the multisig address
   * @param endowmentId the endowment id
   * @param emitter the emitter of the multisig
   * @param owners the owners of the multisig
   * @param required the required number of signatures
   * @param requireExecution the require execution flag
   */
  function createMultisig(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] memory owners,
    uint256 required,
    bool requireExecution
  ) public isOwner {
    isMultisig[multisigAddress] = true;
    emit MultisigCreated(multisigAddress, endowmentId, emitter, owners, required, requireExecution);
  }

  /**
   * @notice emits the EndowmentConfirmation event
   * @param endowmentId the endowment id
   * @param sender the sender of the transaction
   * @param transactionId the transaction id
   */
  function confirmEndowment(
    uint256 endowmentId,
    address sender,
    uint256 transactionId
  ) public isEmitter {
    emit EndowmentConfirmation(endowmentId, sender, transactionId);
  }

  /**
   * @notice emits the EndowmentRevocation event
   * @param endowmentId the endowment id
   * @param sender the sender of the transaction
   * @param transactionId the transaction id
   */
  function revokeEndowment(
    uint256 endowmentId,
    address sender,
    uint256 transactionId
  ) public isEmitter {
    emit EndowmentRevocation(endowmentId, sender, transactionId);
  }

  /**
   * @notice emits the EndowmentSubmission event
   * @param endowmentId the endowment id
   * @param transactionId the transaction id
   * @param transaction the transaction
   */
  function submitEndowment(
    uint256 endowmentId,
    uint256 transactionId,
    MultiSigStorage.Transaction memory transaction
  ) public isEmitter {
    emit EndowmentSubmission(endowmentId, transactionId, transaction);
  }

  /**
   * @notice emits the EndowmentExecution event
   * @param endowmentId the endowment id
   * @param transactionId the transaction id
   */
  function executeEndowment(uint256 endowmentId, uint256 transactionId) public isEmitter {
    emit EndowmentExecution(endowmentId, transactionId);
  }

  /**
   * @notice emits the EndowmentExecutionFailure event
   * @param endowmentId the endowment id
   * @param transactionId the transaction id
   */
  function executeFailureEndowment(uint256 endowmentId, uint256 transactionId) public isEmitter {
    emit EndowmentExecutionFailure(endowmentId, transactionId);
  }

  /**
   * @notice emits the EndowmentDeposit event
   * @param endowmentId the endowment id
   * @param sender the sender of the transaction
   * @param value the value of the transaction
   */
  function depositEndowment(uint256 endowmentId, address sender, uint256 value) public isEmitter {
    emit EndowmentDeposit(endowmentId, sender, value);
  }

  /**
   * @notice emits the EndowmentOwnersAddition event
   * @param endowmentId the endowment id
   * @param owners the added owners of the endowment
   */
  function addOwnersEndowment(uint256 endowmentId, address[] memory owners) public isEmitter {
    emit EndowmentOwnersAddition(endowmentId, owners);
  }

  /**
   * @notice emits the EndowmentOwnersRemoval event
   * @param endowmentId the endowment id
   * @param owners the removed owners of the endowment
   */
  function removeOwnersEndowment(uint256 endowmentId, address[] memory owners) public isEmitter {
    emit EndowmentOwnersRemoval(endowmentId, owners);
  }

  /**
   * @notice emits the EndowmentOwnerReplace event
   * @param endowmentId the endowment id
   * @param currOwner the removed owner of the endowment
   * @param newOwner the added owner of the endowment
   */
  function replaceOwnerEndowment(uint256 endowmentId, address currOwner, address newOwner) public isEmitter {
    emit EndowmentOwnerReplace(endowmentId, currOwner, newOwner);
  }

  /**
   * @notice emits the EndowmentApprovalsRequirementChange event
   * @param endowmentId the endowment id
   * @param approvalsRequired the required number of confirmations
   */
  function approvalsRequirementChangeEndowment(
    uint256 endowmentId,
    uint256 approvalsRequired
  ) public isEmitter {
    emit EndowmentApprovalsRequirementChange(endowmentId, approvalsRequired);
  }
}
