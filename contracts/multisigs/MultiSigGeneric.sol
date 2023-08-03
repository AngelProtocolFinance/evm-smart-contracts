// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Validator} from "../core/validator.sol";
import "./storage.sol";
import {IMultiSigGeneric} from "./interfaces/IMultiSigGeneric.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Utils} from "../lib/utils.sol";

contract MultiSigGeneric is
  StorageMultiSig,
  IMultiSigGeneric,
  ERC165,
  Initializable,
  ReentrancyGuard
{
  /*
   *  Modifiers
   */
  modifier onlyWallet() {
    require(msg.sender == address(this), "Can only be called by the MultiSig itself");
    _;
  }

  modifier ownerDoesNotExist(address _owner) {
    require(!isOwner[_owner], "Owner address dne");
    _;
  }

  modifier ownerExists(address _owner) {
    require(isOwner[_owner], "Owner address already exists");
    _;
  }

  modifier transactionExists(uint256 transactionId) {
    require(Validator.addressChecker(transactions[transactionId].destination), "Transaction dne");
    _;
  }

  modifier confirmed(uint256 transactionId, address _owner) {
    require(
      confirmations[transactionId].confirmationsByOwner[_owner],
      "Transaction is not confirmed"
    );
    _;
  }

  modifier notConfirmed(uint256 transactionId, address _owner) {
    require(
      !confirmations[transactionId].confirmationsByOwner[_owner],
      "Transaction is already confirmed"
    );
    _;
  }

  modifier notExecuted(uint256 transactionId) {
    require(!transactions[transactionId].executed, "Transaction is executed");
    _;
  }

  modifier notExpired(uint256 transactionId) {
    require(transactions[transactionId].expiry > block.timestamp, "Transaction is expired");
    _;
  }

  modifier approvalsThresholdMet(uint256 transactionId) {
    require(
      confirmations[transactionId].count >= approvalsRequired,
      "Not enough confirmations to execute"
    );
    _;
  }

  modifier validApprovalsRequirement(uint256 _ownerCount, uint256 _approvalsRequired) {
    require(
      _approvalsRequired <= _ownerCount && _approvalsRequired != 0,
      "Invalid approvals requirement"
    );
    _;
  }

  /// @dev Receive function allows to deposit ether.
  receive() external payable override {}

  /// @dev Fallback function allows to deposit ether.
  fallback() external payable override {}

  /*
   * Public functions
   */

  /// @dev Allows to add new owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of new owners.
  function addOwners(address[] memory owners) public virtual override onlyWallet {
    require(owners.length > 0, "Empty new owners list passed");
    for (uint256 o = 0; o < owners.length; o++) {
      require(
        Validator.addressChecker(owners[o]),
        string.concat("Invalid owner address at index: ", Strings.toString(o))
      );
      require(!isOwner[owners[o]], "New owner already exists");
      // increment active owners count by 1
      activeOwnersCount += 1;
      // set the owner address to false in mapping
      isOwner[owners[o]] = true;
    }
    emitOwnersAdded(owners);
  }

  /// @dev Allows to remove owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of removed owners.
  function removeOwners(address[] memory owners) public virtual override onlyWallet {
    require(
      owners.length < activeOwnersCount,
      "Must have at least one owner left after all removals"
    );
    // check that all ousted owners are current, existing owners
    for (uint256 o = 0; o < owners.length; o++) {
      require(isOwner[owners[o]], "Ousted owner is not a current owner");
      // decrement active owners count by 1
      activeOwnersCount -= 1;
      // set the owner address to false in mapping
      isOwner[owners[o]] = false;
    }
    emitOwnersRemoved(owners);
    // adjust the approval threshold downward if we've removed more members than can meet the currently
    // set threshold level. (ex. Prevent 10 owners total needing 15 approvals to execute txs)
    if (approvalsRequired > activeOwnersCount) changeApprovalsRequirement(activeOwnersCount);
  }

  /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
  /// @param currOwner Address of current owner to be replaced.
  /// @param newOwner Address of new owner.
  function replaceOwner(
    address currOwner,
    address newOwner
  ) public virtual override onlyWallet ownerExists(currOwner) ownerDoesNotExist(newOwner) {
    require(Validator.addressChecker(newOwner), "Invalid new owner address");
    isOwner[currOwner] = false;
    isOwner[newOwner] = true;
    emitOwnerReplaced(currOwner, newOwner);
  }

  /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
  /// @param _approvalsRequired Number of required confirmations.
  function changeApprovalsRequirement(
    uint256 _approvalsRequired
  )
    public
    virtual
    override
    onlyWallet
    validApprovalsRequirement(activeOwnersCount, _approvalsRequired)
  {
    approvalsRequired = _approvalsRequired;
    emitApprovalsRequiredChanged(_approvalsRequired);
  }

  /// @dev Allows to change whether explicit execution step is needed once the required number of confirmations is met. Transaction has to be sent by wallet.
  /// @param _requireExecution Is an explicit execution step is needed
  function changeRequireExecution(bool _requireExecution) public virtual override onlyWallet {
    requireExecution = _requireExecution;
    emitRequireExecutionChanged(_requireExecution);
  }

  /// @dev Allows to change the expiry time for transactions.
  /// @param _transactionExpiry time that a newly created transaction is valid for
  function changeTransactionExpiry(uint256 _transactionExpiry) public virtual override onlyWallet {
    transactionExpiry = _transactionExpiry;
    emitExpiryChanged(_transactionExpiry);
  }

  /// @dev Allows an owner to submit and confirm a transaction.
  /// @param destination Transaction target address.
  /// @param value Transaction ether value.
  /// @param data Transaction data payload.
  /// @param metadata Encoded transaction metadata, can contain dynamic content.
  /// @return transactionId transaction ID.
  function submitTransaction(
    address destination,
    uint256 value,
    bytes memory data,
    bytes memory metadata
  ) public virtual override returns (uint256 transactionId) {
    transactionId = addTransaction(destination, value, data, metadata);
    confirmTransaction(transactionId);
  }

  /// @dev Allows an owner to confirm a transaction.
  /// @param transactionId Transaction ID.
  function confirmTransaction(
    uint256 transactionId
  )
    public
    virtual
    override
    nonReentrant
    ownerExists(msg.sender)
    transactionExists(transactionId)
    notConfirmed(transactionId, msg.sender)
    notExpired(transactionId)
  {
    confirmations[transactionId].confirmationsByOwner[msg.sender] = true;
    confirmations[transactionId].count += 1;
    emitTransactionConfirmed(msg.sender, transactionId);
    // if execution is not required and confirmation count is met, execute 
    if (!requireExecution && confirmations[transactionId].count >= approvalsRequired) {
      executeTransaction(transactionId);
    }
  }

  /// @dev Allows an owner to revoke a confirmation for a transaction.
  /// @param transactionId Transaction ID.
  function revokeConfirmation(
    uint256 transactionId
  )
    public
    virtual
    override
    nonReentrant
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
    notExpired(transactionId)
  {
    confirmations[transactionId].confirmationsByOwner[msg.sender] = false;
    confirmations[transactionId].count -= 1;
    emitTransactionConfirmationRevoked(msg.sender, transactionId);
  }

  /// @dev Allows current owners to revoke a confirmation for a non-executed transaction from a removed/non-current owner.
  /// @param transactionId Transaction ID.
  /// @param formerOwner Address of the non-current owner, whos confirmation is being revoked
  function revokeConfirmationOfFormerOwner(
    uint256 transactionId,
    address formerOwner
  )
    public
    virtual
    override
    nonReentrant
    ownerExists(msg.sender)
    confirmed(transactionId, formerOwner)
    notExecuted(transactionId)
    notExpired(transactionId)
  {
    require(!isOwner[formerOwner], "Attempting to revert confirmation of a current owner");
    confirmations[transactionId].confirmationsByOwner[formerOwner] = false;
    confirmations[transactionId].count -= 1;
    emitTransactionConfirmationRevoked(formerOwner, transactionId);
  }

  /// @dev Allows anyone to execute a confirmed transaction.
  /// @param transactionId Transaction ID.
  function executeTransaction(
    uint256 transactionId
  )
    public
    virtual
    override
    approvalsThresholdMet(transactionId)
    notExecuted(transactionId)
    notExpired(transactionId)
  {
    MultiSigStorage.Transaction storage txn = transactions[transactionId];
    txn.executed = true;
    Utils._execute(txn.destination, txn.value, txn.data);
    emitTransactionExecuted(transactionId);
  }

  /// @dev Returns the confirmation status of a transaction.
  /// @param transactionId Transaction ID.
  /// @return Confirmation status.
  function isConfirmed(uint256 transactionId) public view override returns (bool) {
    if (confirmations[transactionId].count >= approvalsRequired) return true;
    return false;
  }

  /// @dev Returns number of confirmations of a transaction.
  /// @param transactionId Transaction ID.
  /// @return uint256
  function getConfirmationCount(
    uint256 transactionId
  ) public view override transactionExists(transactionId) returns (uint256) {
    return confirmations[transactionId].count;
  }

  function getConfirmationStatus(
    uint256 transactionId,
    address ownerAddr
  ) public view override transactionExists(transactionId) returns (bool) {
    return confirmations[transactionId].confirmationsByOwner[ownerAddr];
  }

  /// @dev Returns whether an address is an active owner.
  /// @return Bool. True if owner is an active owner.
  function getOwnerStatus(address ownerAddr) public view override returns (bool) {
    return isOwner[ownerAddr];
  }

  /*
   * Internal functions
   */
  /// @dev Contract constructor sets initial owners and required number of confirmations.
  /// @param owners List of initial owners.
  /// @param _approvalsRequired Number of required confirmations.
  /// @param _requireExecution setting for if an explicit execution call is required
  /// @param _transactionExpiry Proposal expiry time in seconds
  function initialize(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) internal initializer validApprovalsRequirement(owners.length, _approvalsRequired) {
    require(owners.length > 0, "Must pass at least one owner address");
    for (uint256 i = 0; i < owners.length; i++) {
      require(
        Validator.addressChecker(owners[i]),
        string.concat("Invalid owner address at index: ", Strings.toString(i))
      );
      isOwner[owners[i]] = true;
    }
    activeOwnersCount = owners.length;

    // set storage variables
    approvalsRequired = _approvalsRequired;
    requireExecution = _requireExecution;
    transactionExpiry = _transactionExpiry;
    emitInitializedMultiSig(owners, approvalsRequired, requireExecution, transactionExpiry);
  }

  /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
  /// @param destination Transaction target address.
  /// @param value Transaction ether value.
  /// @param data Transaction data payload.
  /// @param metadata Encoded transaction metadata, can contain dynamic content.
  /// @return transactionId Returns transaction ID.
  function addTransaction(
    address destination,
    uint256 value,
    bytes memory data,
    bytes memory metadata
  ) internal virtual override returns (uint256 transactionId) {
    require(Validator.addressChecker(destination), "Invalid destination address");
    transactionId = transactionCount;
    transactions[transactionId] = MultiSigStorage.Transaction({
      destination: destination,
      value: value,
      data: data,
      expiry: block.timestamp + transactionExpiry,
      executed: false,
      metadata: metadata
    });
    transactionCount += 1;
    emitTransactionSubmitted(msg.sender, transactionId, metadata);
  }

  /// @dev Emits an event post-initialization.
  /// @param owners List of initial owners.
  /// @param _approvalsRequired Number of required confirmations.
  /// @param _requireExecution setting for if an explicit execution call is required.
  /// @param _transactionExpiry Proposal expiry time in seconds.
  function emitInitializedMultiSig(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) internal virtual {
    emit InitializedMultiSig(
      address(this),
      owners,
      _approvalsRequired,
      _requireExecution,
      _transactionExpiry
    );
  }

  /// @dev Emits an event when owners are added.
  /// @param owners Addresses of new owners.
  function emitOwnersAdded(address[] memory owners) internal virtual {
    emit OwnersAdded(address(this), owners);
  }

  /// @dev Emits an event when owners are removed.
  /// @param owners Addresses of new owners.
  function emitOwnersRemoved(address[] memory owners) internal virtual {
    emit OwnersRemoved(address(this), owners);
  }

  /// @dev Emits an event when owners are replaced.
  /// @param currOwner Address of current owner to be replaced.
  /// @param newOwner Address of new owner.
  function emitOwnerReplaced(address currOwner, address newOwner) internal virtual {
    emit OwnerReplaced(address(this), currOwner, newOwner);
  }

  /// @dev Emits an event when the number of required confirmations is updated.
  /// @param _approvalsRequired Number of required confirmations.
  function emitApprovalsRequiredChanged(uint256 _approvalsRequired) internal virtual {
    emit ApprovalsRequiredChanged(address(this), _approvalsRequired);
  }

  /// @dev Emits an event when there's an update to the flag indicating whether explicit execution step is needed.
  /// @param _requireExecution Is an explicit execution step is needed.
  function emitRequireExecutionChanged(bool _requireExecution) internal virtual {
    emit RequireExecutionChanged(address(this), _requireExecution);
  }

  /// @dev Emits an event when expiry time for transactions is updated.
  /// @param _transactionExpiry time that a newly created transaction is valid for.
  function emitExpiryChanged(uint256 _transactionExpiry) internal virtual {
    emit ExpiryChanged(address(this), _transactionExpiry);
  }

  /// @dev Emits an event when a transaction is submitted.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  /// @param metadata Encoded transaction metadata, can contain dynamic content.
  function emitTransactionSubmitted(
    address sender,
    uint256 transactionId,
    bytes memory metadata
  ) internal virtual {
    emit TransactionSubmitted(address(this), sender, transactionId, metadata);
  }

  /// @dev Emits an event when a transaction is confirmed.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  function emitTransactionConfirmed(address sender, uint256 transactionId) internal virtual {
    emit TransactionConfirmed(address(this), sender, transactionId);
  }

  /// @dev Emits an event when a transaction confirmation is revoked.
  /// @param sender Sender of the Transaction.
  /// @param transactionId Transaction ID.
  function emitTransactionConfirmationRevoked(
    address sender,
    uint256 transactionId
  ) internal virtual {
    emit TransactionConfirmationRevoked(address(this), sender, transactionId);
  }

  /// @dev Emits an event when a transaction is executed.
  /// @param transactionId Transaction ID.
  function emitTransactionExecuted(uint256 transactionId) internal virtual {
    emit TransactionExecuted(address(this), transactionId);
  }
}
