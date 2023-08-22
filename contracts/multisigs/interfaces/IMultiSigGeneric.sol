// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

abstract contract IMultiSigGeneric is IERC165 {
  /*
   *  Events
   */
  event InitializedMultiSig(
    address msAddress,
    address[] owners,
    uint256 approvalsRequired,
    bool requireExecution,
    uint256 transactionExpiry
  );
  event OwnersAdded(address msAddress, address[] owners);
  event OwnersRemoved(address msAddress, address[] owners);
  event OwnerReplaced(address msAddress, address currOwner, address newOwner);
  event ApprovalsRequiredChanged(address msAddress, uint256 approvalsRequired);
  event RequireExecutionChanged(address msAddress, bool requireExecution);
  event ExpiryChanged(address msAddress, uint256 transactionExpiry);
  event TransactionSubmitted(
    address msAddress,
    address sender,
    uint256 transactionId,
    bytes metadata
  );
  event TransactionConfirmed(address msAddress, address sender, uint256 transactionId);
  event TransactionConfirmationRevoked(address msAddress, address sender, uint256 transactionId);
  event TransactionExecuted(address msAddress, uint256 transactionId);

  /// @dev Receive function allows to deposit ether.
  receive() external payable virtual;

  /// @dev Fallback function allows to deposit ether.
  fallback() external payable virtual;

  /// @dev Allows to add new owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of new owners.
  function addOwners(address[] memory owners) public virtual;

  /// @dev Allows to remove owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of ousted owners.
  function removeOwners(address[] memory owners) public virtual;

  /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
  /// @param currOwner Address of owner to be replaced.
  /// @param newOwner Address of new owner.
  function replaceOwner(address currOwner, address newOwner) public virtual;

  /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
  /// @param approvalsRequired Number of required confirmations.
  function changeApprovalsRequirement(uint256 approvalsRequired) public virtual;

  /// @dev Allows to change whether explicit execution step is needed once the required number of confirmations is met. Transaction has to be sent by wallet.
  /// @param requireExecution Explicit execution step is needed
  function changeRequireExecution(bool requireExecution) public virtual;

  /// @dev Allows to change the expiry time for transactions.
  /// @param _transactionExpiry time that a newly created transaction is valid for
  function changeTransactionExpiry(uint256 _transactionExpiry) public virtual;

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
  ) public virtual returns (uint256 transactionId);

  /// @dev Allows an owner to confirm a transaction.
  /// @param transactionId Transaction ID.
  function confirmTransaction(uint256 transactionId) public virtual;

  /// @dev Allows an owner to revoke a confirmation for a transaction.
  /// @param transactionId Transaction ID.
  function revokeConfirmation(uint256 transactionId) public virtual;

  /// @dev Allows current owners to revoke a confirmation for a non-executed transaction from a removed/non-current owner.
  /// @param transactionId Transaction ID.
  /// @param formerOwner Address of the non-current owner, whos confirmation is being revoked
  function revokeConfirmationOfFormerOwner(
    uint256 transactionId,
    address formerOwner
  ) public virtual;

  /// @dev Allows anyone to execute a confirmed transaction.
  /// @param transactionId Transaction ID.
  function executeTransaction(uint256 transactionId) public virtual;

  /// @dev Returns the confirmation status of a transaction.
  /// @param transactionId Transaction ID.
  /// @return Confirmation status.
  function isConfirmed(uint256 transactionId) public view virtual returns (bool);

  /*
   * Internal functions
   */
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
  ) internal virtual returns (uint256 transactionId);

  /*
   * Web3 call functions
   */
  /// @dev Returns number of confirmations of a transaction.
  /// @param transactionId Transaction ID.
  /// @return uint256
  function getConfirmationCount(uint256 transactionId) public view virtual returns (uint256);

  /// @dev Returns status of confirmations of a transaction for a given owner.
  /// @param transactionId Transaction ID.
  /// @param ownerAddr address of an owner
  /// @return bool
  function getConfirmationStatus(
    uint256 transactionId,
    address ownerAddr
  ) public view virtual returns (bool);

  /// @dev Returns whether an address is an active owner.
  /// @return Bool. True if owner is an active owner.
  function getOwnerStatus(address ownerAddr) public view virtual returns (bool);
}
