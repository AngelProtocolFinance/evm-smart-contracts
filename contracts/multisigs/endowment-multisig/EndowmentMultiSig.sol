// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Validator} from "../../core/validator.sol";
import {Utils} from "../../lib/utils.sol";
import {MultiSigGeneric} from "../../multisigs/MultiSigGeneric.sol";
import {MultiSigStorage} from "../../multisigs/storage.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";

/**
 * @notice the endowment multisig contract
 * @dev the endowment multisig contract is a generic multisig contract with a special initialize function
 */
contract EndowmentMultiSig is MultiSigGeneric {
  uint256 public ENDOWMENT_ID;
  address public EMITTER_ADDRESS;

  /**
   * @notice initialize the multisig with the endowment id and the endowment multisig emitter address
   * @dev special initialize function for endowment multisig
   * @param _endowmentId the endowment id
   * @param _emitter the endowment multisig emitter address
   * @param _owners the owners of the multisig
   * @param _required the required number of signatures
   * @param _requireExecution the require execution flag
   * @param _transactionExpiry the duration of validity for newly created transactions
   */
  function initialize(
    uint256 _endowmentId,
    address _emitter,
    address[] memory _owners,
    uint256 _required,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) public initializer {
    require(Validator.addressChecker(_emitter), "Invalid Emitter Address");
    ENDOWMENT_ID = _endowmentId;
    EMITTER_ADDRESS = _emitter;
    super.initialize(_owners, _required, _requireExecution, _transactionExpiry);
  }

  /// @dev Emits an event when owners are added.
  /// @param owners Addresses of new owners.
  function emitOwnersAdded(address[] memory owners) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownersAddedEndowment(ENDOWMENT_ID, owners);
  }

  /// @dev Emits an event when owners are removed.
  /// @param owners Addresses of new owners.
  function emitOwnersRemoved(address[] memory owners) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownersRemovedEndowment(ENDOWMENT_ID, owners);
  }

  /// @dev Emits an event when owners are replaced.
  /// @param currOwner Address of current owner to be replaced.
  /// @param newOwner Address of new owner.
  function emitOwnerReplaced(address currOwner, address newOwner) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownerReplacedEndowment(
      ENDOWMENT_ID,
      currOwner,
      newOwner
    );
  }

  /// @dev Emits an event when the number of required confirmations is updated.
  /// @param _approvalsRequired Number of required confirmations.
  function emitApprovalsRequiredChanged(uint256 _approvalsRequired) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).approvalsRequirementChangedEndowment(
      ENDOWMENT_ID,
      _approvalsRequired
    );
  }

  /// @dev Emits an event when there's an update to the flag indicating whether explicit execution step is needed.
  /// @param _requireExecution Is an explicit execution step is needed.
  function emitRequireExecutionChanged(bool _requireExecution) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).requireExecutionChangedEndowment(
      ENDOWMENT_ID,
      _requireExecution
    );
  }

  /// @dev Emits an event when expiry time for transactions is updated.
  /// @param _transactionExpiry time that a newly created transaction is valid for.
  function emitExpiryChanged(uint256 _transactionExpiry) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).expiryChangedEndowment(
      ENDOWMENT_ID,
      _transactionExpiry
    );
  }

  /// @dev Emits an event when a transaction is submitted.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  /// @param metadata Encoded transaction metadata, can contain dynamic content.
  function emitTransactionSubmitted(
    address sender,
    uint256 transactionId,
    bytes memory metadata
  ) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionSubmittedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId,
      metadata
    );
  }

  /// @dev Emits an event when a transaction is confirmed.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  function emitTransactionConfirmed(address sender, uint256 transactionId) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionConfirmedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId
    );
  }

  /// @dev Emits an event when a transaction confirmation is revoked.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  function emitTransactionConfirmationRevoked(
    address sender,
    uint256 transactionId
  ) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionConfirmationRevokedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId
    );
  }

  /// @dev Emits an event when a transaction is executed.
  /// @param transactionId Transaction ID.
  function emitTransactionExecuted(uint256 transactionId) internal override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionExecutedEndowment(
      ENDOWMENT_ID,
      transactionId
    );
  }
}
