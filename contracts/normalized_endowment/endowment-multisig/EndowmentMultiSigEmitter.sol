// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @notice the endowment multisig emitter contract
 * @dev the endowment multisig emitter contract is a contract that emits events for all the endowment multisigs across AP
 */
contract EndowmentMultiSigEmitter is IEndowmentMultiSigEmitter, Initializable {
  /*
   * Events
   */
  event EndowmentMultisigCreated(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] owners,
    uint256 required,
    bool requireExecution,
    uint256 transactionExpiry
  );
  event TransactionSubmitted(uint256 endowmentId, address owner, uint256 transactionId);
  event TransactionConfirmed(uint256 endowmentId, address owner, uint256 transactionId);
  event TransactionConfirmationRevoked(uint256 endowmentId, address owner, uint256 transactionId);
  event TransactionConfirmationOfFormerOwnerRevoked(uint256 endowmentId, address formerOwner, uint256 transactionId);
  event TransactionExecuted(uint256 endowmentId, uint256 transactionId);
  event OwnersAdded(uint256 endowmentId, address[] owners);
  event OwnersRemoved(uint256 endowmentId, address[] owners);
  event OwnerReplaced(uint256 endowmentId, address currOwner, address newOwner);
  event ApprovalsRequirementChanged(uint256 endowmentId, uint256 approvalsRequired);
  event RequireExecutionChanged(uint256 endowmentId, bool requireExecution);
  event ExpiryChanged(uint256 endowmentId, uint256 transactionExpiry);

  address multisigFactory;
  mapping(address => bool) isMultisig;

  function initEndowmentMultiSigEmitter(address _multisigFactory) public initializer {
    require(_multisigFactory != address(0), "Invalid Address");
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

  /**
   * @notice emits EndowmentMultisigCreated event
   * @param multisigAddress the multisig address
   * @param endowmentId the endowment id
   * @param emitter the emitter of the multisig
   * @param owners the owners of the multisig
   * @param required the required number of signatures
   * @param requireExecution the require execution flag
   * @param transactionExpiry duration of validity for newly created transactions
   */
  function createEndowmentMultisig(
    address multisigAddress,
    uint256 endowmentId,
    address emitter,
    address[] memory owners,
    uint256 required,
    bool requireExecution,
    uint256 transactionExpiry
  ) public isOwner {
    isMultisig[multisigAddress] = true;
    emit EndowmentMultisigCreated(
      multisigAddress,
      endowmentId,
      emitter,
      owners,
      required,
      requireExecution,
      transactionExpiry
    );
  }

  /**
   * @notice emits the EndowmentSubmitted event
   * @param endowmentId the endowment id
   * @param transactionId the transaction id
   */
  function transactionSubmittedEndowment(uint256 endowmentId, address owner, uint256 transactionId) public isEmitter {
    emit TransactionSubmitted(endowmentId, owner, transactionId);
  }

  /**
   * @notice emits the EndowmentConfirmed event
   * @param endowmentId the endowment id
   * @param owner the sender of the transaction
   * @param transactionId the transaction id
   */
  function transactionConfirmedEndowment(
    uint256 endowmentId,
    address owner,
    uint256 transactionId
  ) public isEmitter {
    emit TransactionConfirmed(endowmentId, owner, transactionId);
  }

  /**
   * @notice emits the ConfirmationRevoked event
   * @param endowmentId the endowment id
   * @param owner the sender of the transaction
   * @param transactionId the transaction id
   */
  function transactionConfirmationRevokedEndowment(
    uint256 endowmentId,
    address owner,
    uint256 transactionId
  ) public isEmitter {
    emit TransactionConfirmationRevoked(endowmentId, owner, transactionId);
  }

  /**
   * @notice emits the ConfirmationOfFormerOwnerRevoked event
   * @param endowmentId the endowment id
   * @param formerOwner the former owner being revoked
   * @param transactionId the transaction id
   */
  function transactionConfirmationOfFormerOwnerRevokedEndowment(
    uint256 endowmentId,
    address formerOwner,
    uint256 transactionId
  ) public isEmitter {
    emit TransactionConfirmationOfFormerOwnerRevoked(endowmentId, formerOwner, transactionId);
  }


  /**
   * @notice emits the TransactionExecuted event
   * @param endowmentId the endowment id
   * @param transactionId the transaction id
   */
  function transactionExecutedEndowment(uint256 endowmentId, uint256 transactionId) public isEmitter {
    emit TransactionExecuted(endowmentId, transactionId);
  }

  /**
   * @notice emits the OwnersAdded event
   * @param endowmentId the endowment id
   * @param owners the added owners of the endowment
   */
  function ownersAddedEndowment(uint256 endowmentId, address[] memory owners) public isEmitter {
    emit OwnersAdded(endowmentId, owners);
  }

  /**
   * @notice emits the OwnersRemoved event
   * @param endowmentId the endowment id
   * @param owners the removed owners of the endowment
   */
  function ownersRemovedEndowment(uint256 endowmentId, address[] memory owners) public isEmitter {
    emit OwnersRemoved(endowmentId, owners);
  }

  /**
   * @notice emits the OwnerReplaced event
   * @param endowmentId the endowment id
   * @param newOwner the added owner of the endowment
   */
  function ownerReplacedEndowment(
    uint256 endowmentId,
    address currOwner,
    address newOwner
  ) public isEmitter {
    emit OwnerReplaced(endowmentId, currOwner, newOwner);
  }

  /**
   * @notice emits the ApprovalsRequirementChanged event
   * @param endowmentId the endowment id
   * @param approvalsRequired the required number of confirmations
   */
  function approvalsRequirementChangedEndowment(
    uint256 endowmentId,
    uint256 approvalsRequired
  ) public isEmitter {
    emit ApprovalsRequirementChanged(endowmentId, approvalsRequired);
  }

  /**
   * @notice emits the ApprovalsRequirementChanged event
   * @param endowmentId the endowment id
   * @param requireExecution Explicit execution step is needed
   */
  function requireExecutionChangedEndowment(
    uint256 endowmentId,
    bool requireExecution
  ) public isEmitter {
    emit RequireExecutionChanged(endowmentId, requireExecution);
  }

  /**
   * @notice emits the EndowmentTransactionExpiryChanged event
   * @param endowmentId the endowment id
   * @param transactionExpiry the duration a newly created transaction is valid for
   */
  function expiryChangedEndowment(
    uint256 endowmentId,
    uint256 transactionExpiry
  ) public isEmitter {
    emit ExpiryChanged(endowmentId, transactionExpiry);
  }
}
