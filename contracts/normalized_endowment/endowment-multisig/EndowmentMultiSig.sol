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

  // @dev overrides the generic multisig initializer and restricted function
  function initialize(address[] memory, uint256, bool) public override initializer {
    revert("Not Implemented");
  }

  /**
   * @notice initialize the multisig with the endowment id and the endowment multisig emitter address
   * @dev special initialize function for endowment multisig
   * @param _endowmentId the endowment id
   * @param _emitter the endowment multisig emitter address
   * @param _owners the owners of the multisig
   * @param _required the required number of signatures
   * @param _requireExecution the require execution flag
   */
  function initialize(
    uint256 _endowmentId,
    address _emitter,
    address[] memory _owners,
    uint256 _required,
    bool _requireExecution
  ) public initializer {
    require(_emitter != address(0), "Invalid Address");
    ENDOWMENT_ID = _endowmentId;
    EMITTER_ADDRESS = _emitter;
    super.initialize(_owners, _required, _requireExecution);
  }

  /// @dev Allows to add new owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of new owners.
  function addOwners(address[] memory owners) public override onlyWallet {
    require(owners.length > 0, "Empty new owners list passed");
    for (uint256 o = 0; o < owners.length; o++) {
      require(!isOwner[owners[o]], "New owner already exists");
      // increment active owners count by 1
      activeOwnersCount += 1;
      // set the owner address to false in mapping
      isOwner[owners[o]] = true;
      IEndowmentMultiSigEmitter(EMITTER_ADDRESS).addOwnerEndowment(ENDOWMENT_ID, owners[o]);
    }
  }

  /// @dev Allows to remove owners. Transaction has to be sent by wallet.
  /// @param owners Addresses of removed owners.
  function removeOwners(address[] memory owners) public override onlyWallet {
    // check that all ousted owners are current, existing owners
    for (uint256 oo = 0; oo < owners.length; oo++) {
      require(isOwner[owners[oo]], "Ousted owner is not a current owner");
      // decrement active owners count by 1
      activeOwnersCount -= 1;
      // set the owner address to false in mapping
      isOwner[owners[oo]] = false;
      IEndowmentMultiSigEmitter(EMITTER_ADDRESS).removeOwnerEndowment(ENDOWMENT_ID, owners[oo]);
    }
    // adjust the approval threshold downward if we've removed more members than can meet the currently
    // set threshold level. (ex. Prevent 10 owners total needing 15 approvals to execute txs)
    if (approvalsRequired > activeOwnersCount) changeApprovalsRequirement(activeOwnersCount);
  }

  /**
   * @notice overrides the generic multisig replaceOwner function
   * @dev emits the removeOwnerEndowment and addOwnerEndowment events
   * @param currOwner the owner to be replaced
   * @param newOwner the new owner to add
   */
  function replaceOwner(address currOwner, address newOwner) public override {
    super.replaceOwner(currOwner, newOwner);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).removeOwnerEndowment(ENDOWMENT_ID, currOwner);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).addOwnerEndowment(ENDOWMENT_ID, newOwner);
  }

  /**
   * @notice overrides the generic multisig changeRequirement function
   * @dev emits the requirementChangeEndowment event
   * @param _approvalsRequired the new required number of signatures
   */
  function changeApprovalsRequirement(uint256 _approvalsRequired) public override {
    super.changeApprovalsRequirement(_approvalsRequired);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).approvalsRequirementChangeEndowment(
      ENDOWMENT_ID,
      _approvalsRequired
    );
  }

  /**
   * @notice overrides the generic multisig changeRequireExecution function
   * @dev emits the requirementChangeEndowment event
   * @param _requireExecution Explicit execution step is needed
   */
  function changeRequireExecution(bool _requireExecution) public override {
    super.changeRequireExecution(_requireExecution);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).requireExecutionChangeEndowment(
      ENDOWMENT_ID,
      _requireExecution
    );
  }

  /// @dev Allows an owner to submit and confirm a transaction.
  /// @param title title related to txn
  /// @param description description related to txn
  /// @param destination Transaction target address.
  /// @param value Transaction ether value.
  /// @param data Transaction data payload.
  /// @return transactionId transaction ID.
  function submitTransaction(
    string memory title,
    string memory description,
    address destination,
    uint256 value,
    bytes memory data,
    bytes memory metadata
  ) public virtual override returns (uint256 transactionId) {
    transactionId = addTransaction(title, description, destination, value, data, metadata);
    confirmTransaction(transactionId);
  }

  /**
   * @notice overrides the generic multisig confirmTransaction function
   * @dev emits the confirmEndowment event
   * @param transactionId the transaction id
   */
  function confirmTransaction(uint256 transactionId) public override {
    super.confirmTransaction(transactionId);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).confirmEndowment(
      ENDOWMENT_ID,
      msg.sender,
      transactionId
    );
  }

  /**
   * @notice overrides the generic multisig revokeConfirmation function
   * @dev emits the revokeEndowment event
   * @param transactionId the transaction id
   */
  function revokeConfirmation(uint256 transactionId) public override {
    super.revokeConfirmation(transactionId);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).revokeEndowment(
      ENDOWMENT_ID,
      msg.sender,
      transactionId
    );
  }

  /**
   * @notice function called when a proposal has to be explicity executed
   * @dev emits the executeEndowment event, overrides underlying execute function
   * @param transactionId the transaction id
   */
  function executeTransaction(
    uint256 transactionId
  )
    public
    override
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
  {
    if (isConfirmed(transactionId)) {
      MultiSigStorage.Transaction storage txn = transactions[transactionId];
      txn.executed = true;
      Utils._execute(txn.destination, txn.value, txn.data);
      emit Execution(transactionId);
      IEndowmentMultiSigEmitter(EMITTER_ADDRESS).executeEndowment(ENDOWMENT_ID, transactionId);
    }
  }

  /**
   * @notice overrides the generic multisig addTransaction function
   * @dev emits the submitEndowment event
   * @param title the title of the transaction
   * @param description the description of the transaction
   * @param destination the destination of the transaction
   * @param value the value of the transaction
   * @param data the data of the transaction
   * @param metadata Encoded transaction metadata, can contain dynamic content.
   */
  function addTransaction(
    string memory title,
    string memory description,
    address destination,
    uint256 value,
    bytes memory data,
    bytes memory metadata
  ) internal override returns (uint256 transactionId) {
    transactionId = super.addTransaction(title, description, destination, value, data, metadata);
    IEndowmentMultiSigEmitter(EMITTER_ADDRESS).submitEndowment(
      ENDOWMENT_ID,
      transactionId,
      MultiSigStorage.Transaction({
        title: title,
        description: description,
        destination: destination,
        value: value,
        data: data,
        executed: false,
        metadata: metadata
      })
    );
    return transactionId;
  }
}
