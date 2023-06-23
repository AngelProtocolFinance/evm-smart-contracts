// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./storage.sol";
import {IMultiSigGeneric} from "./interfaces/IMultiSigGeneric.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
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
    require(msg.sender == address(this));
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
    require(transactions[transactionId].destination != address(0), "Transaction dne");
    _;
  }

  modifier confirmed(uint256 transactionId, address _owner) {
    require(confirmations[transactionId].confirmationsByOwner[_owner], "Transaction is confirmed");
    _;
  }

  modifier notConfirmed(uint256 transactionId, address _owner) {
    require(
      !confirmations[transactionId].confirmationsByOwner[_owner],
      "Transaction is not confirmed"
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

  modifier notNull(address addr) {
    require(addr != address(0), "Address cannot be a zero address");
    _;
  }

  modifier validApprovalsRequirement(uint256 _ownerCount, uint256 _approvalsRequired) {
    require(_approvalsRequired <= _ownerCount && _approvalsRequired != 0);
    _;
  }

  /// @dev Receive function allows to deposit ether.
  receive() external payable override {
    if (msg.value > 0) emit GasDeposited(msg.sender, msg.value);
  }

  /// @dev Fallback function allows to deposit ether.
  fallback() external payable override {
    if (msg.value > 0) emit GasDeposited(msg.sender, msg.value);
  }

  /*
   * Public functions
   */
  /// @dev Contract constructor sets initial owners and required number of confirmations.
  /// @param owners List of initial owners.
  /// @param _approvalsRequired Number of required confirmations.
  /// @param _requireExecution setting for if an explicit execution call is required
  function initialize(
    address[] memory owners,
    uint256 _approvalsRequired,
    bool _requireExecution,
    uint256 _transactionExpiry
  ) public virtual initializer validApprovalsRequirement(owners.length, _approvalsRequired) {
    require(owners.length > 0, "Must pass at least one owner address");
    for (uint256 i = 0; i < owners.length; i++) {
      require(!isOwner[owners[i]] && owners[i] != address(0));
      isOwner[owners[i]] = true;
    }
    // set storage variables
    approvalsRequired = _approvalsRequired;
    requireExecution = _requireExecution;
    transactionExpiry = _transactionExpiry;
  }

  /// @dev Allows to add new owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of new owners.
  function addOwners(address[] memory owners) public virtual override onlyWallet {
    require(owners.length > 0, "Empty new owners list passed");
    for (uint256 o = 0; o < owners.length; o++) {
      require(!isOwner[owners[o]], "New owner already exists");
      // increment active owners count by 1
      activeOwnersCount += 1;
      // set the owner address to false in mapping
      isOwner[owners[o]] = true;
      emit OwnerAdded(owners[o]);
    }
  }

  /// @dev Allows to remove owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of removed owners.
  function removeOwners(address[] memory owners) public virtual override onlyWallet {
    require(
      owners.length < activeOwnersCount,
      "Must have at least one owner left after all removals"
    );
    // check that all ousted owners are current, existing owners
    for (uint256 oo = 0; oo < owners.length; oo++) {
      require(isOwner[owners[oo]], "Ousted owner is not a current owner");
      // decrement active owners count by 1
      activeOwnersCount -= 1;
      // set the owner address to false in mapping
      isOwner[owners[oo]] = false;
      emit OwnerRemoved(owners[oo]);
    }
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
    isOwner[currOwner] = false;
    isOwner[newOwner] = true;
    emit OwnerRemoved(currOwner);
    emit OwnerAdded(newOwner);
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
    uint256 oldValue = approvalsRequired;
    approvalsRequired = _approvalsRequired;
    emit ApprovalsRequirementChanged(oldValue, _approvalsRequired);
  }

  /// @dev Allows to change whether explicit execution step is needed once the required number of confirmations is met. Transaction has to be sent by wallet.
  /// @param _requireExecution Is an explicit execution step is needed
  function changeRequireExecution(bool _requireExecution) public virtual override onlyWallet {
    bool oldValue = requireExecution;
    requireExecution = _requireExecution;
    emit RequireExecutionChanged(oldValue, _requireExecution);
  }

  /// @dev Allows to change the expiry time for transactions.
  /// @param _transactionExpiry time that a newly created transaction is valid for
  function changeTransactionExpiry(uint256 _transactionExpiry) public virtual override onlyWallet {
    transactionExpiry = _transactionExpiry;
    emit TransactionExpiryChange(_transactionExpiry);
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
    emit TransactionConfirmed(msg.sender, transactionId);
    // if execution is required, do not auto execute
    if (!requireExecution) {
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
    emit ConfirmationRevoked(msg.sender, transactionId);
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
    emit ConfirmationRevoked(formerOwner, transactionId);
  }

  /// @dev Allows anyone to execute a confirmed transaction.
  /// @param transactionId Transaction ID.
  function executeTransaction(
    uint256 transactionId
  )
    public
    virtual
    override
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
    notExpired(transactionId)
  {
    if (isConfirmed(transactionId)) {
      MultiSigStorage.Transaction storage txn = transactions[transactionId];
      txn.executed = true;
      Utils._execute(txn.destination, txn.value, txn.data);
      emit TransactionExecuted(transactionId);
    }
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
  /// @return count
  function getConfirmationCount(
    uint256 transactionId
  ) public view override transactionExists(transactionId) returns (uint256 count) {
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
  ) internal virtual override notNull(destination) returns (uint256 transactionId) {
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
    emit TransactionSubmitted(msg.sender, transactionId);
  }
}
