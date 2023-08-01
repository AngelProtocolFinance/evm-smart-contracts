// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {MultiSigGeneric} from "../../multisigs/MultiSigGeneric.sol";
import {IEndowmentMultiSigEmitter} from "./interfaces/IEndowmentMultiSigEmitter.sol";
import {MultiSigStorage} from "../../multisigs/storage.sol";
import {Utils} from "../../lib/utils.sol";

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
    require(_emitter != address(0), "Invalid Address");
    ENDOWMENT_ID = _endowmentId;
    EMITTER_ADDRESS = _emitter;
    super.initialize(_owners, _required, _requireExecution, _transactionExpiry);
  }

  /// @dev Allows to add new owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of new owners.
  function emitOwnersAdded(address[] memory owners) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownersAddedEndowment(ENDOWMENT_ID, owners);
  }

  /// @dev Allows to remove owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of removed owners.
  function emitOwnersRemoved(address[] memory owners) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownersRemovedEndowment(ENDOWMENT_ID, owners);
  }

  /**
   * @notice overrides the generic multisig replaceOwner function
   * @dev emits the removeOwnerEndowment and addOwnerEndowment events
   * @param currOwner the owner to be replaced
   * @param newOwner the new owner to add
   */
  function emitOwnerReplaced(address currOwner, address newOwner) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).ownerReplacedEndowment(
      ENDOWMENT_ID,
      currOwner,
      newOwner
    );
  }

  /**
   * @notice overrides the generic multisig changeRequirement function
   * @dev emits the requirementChangeEndowment event
   * @param _approvalsRequired the new required number of signatures
   */
  function emitApprovalsRequiredChanged(uint256 _approvalsRequired) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).approvalsRequirementChangedEndowment(
      ENDOWMENT_ID,
      _approvalsRequired
    );
  }

  /**
   * @notice overrides the generic multisig changeTransactionExpiry function
   * @dev emits the transactionExpiryChangeEndowment event
   * @param _transactionExpiry the new validity for newly created transactions
   */
  function emitExpiryChanged(uint256 _transactionExpiry) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).expiryChangedEndowment(
      ENDOWMENT_ID,
      _transactionExpiry
    );
  }

  /**
   * @notice overrides the generic multisig changeRequireExecution function
   * @dev emits the requirementChangeEndowment event
   * @param _requireExecution Explicit execution step is needed
   */
  function emitRequireExecutionChanged(bool _requireExecution) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).requireExecutionChangedEndowment(
      ENDOWMENT_ID,
      _requireExecution
    );
  }

  function emitTransactionSubmitted(
    address sender,
    uint256 transactionId,
    bytes memory metadata
  ) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionSubmittedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId,
      metadata
    );
  }

  /**
   * @notice overrides the generic multisig confirmTransaction function
   * @dev emits the confirmEndowment event
   * @param transactionId the transaction id
   */
  function emitTransactionConfirmed(address sender, uint256 transactionId) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionConfirmedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId
    );
  }

  /**
   * @notice overrides the generic multisig revokeConfirmation function
   * @dev emits the revokeEndowment event
   * @param transactionId the transaction id
   */
  function emitTransactionConfirmationRevoked(
    address sender,
    uint256 transactionId
  ) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionConfirmationRevokedEndowment(
      ENDOWMENT_ID,
      sender,
      transactionId
    );
  }

  /**
   * @notice function called when a proposal has to be explicity executed
   * @dev emits the executeEndowment event, overrides underlying execute function
   * @param transactionId the transaction id
   */
  function emitTransactionExecuted(uint256 transactionId) public override {
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).transactionExecutedEndowment(
      ENDOWMENT_ID,
      transactionId
    );
  }
}
