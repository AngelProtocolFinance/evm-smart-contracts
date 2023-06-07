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

    // @dev overriden the generic multisig initializer and restricted function
    function initialize(
        address[] memory,
        uint256,
        bool
    ) public override initializer {
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

    /**
     * @notice overriden the generic multisig addOwner function
     * @dev emits the addOwnerEndowment event
     * @param _owner the owner to be added
     */
    function addOwner(address _owner) public override {
        super.addOwner(_owner);
        IEndowmentMultiSigEmitter(EMITTER_ADDRESS).addOwnerEndowment(
            ENDOWMENT_ID,
            _owner
        );
    }

    /**
     * @notice overriden the generic multisig removeOwner function
     * @dev emits the removeOwnerEndowment event
     * @param _owner the owner to be removed
     */
    function removeOwner(address _owner) public override {
        super.removeOwner(_owner);
        IEndowmentMultiSigEmitter(EMITTER_ADDRESS).removeOwnerEndowment(
            ENDOWMENT_ID,
            _owner
        );
    }

    /**
     * @notice overriden the generic multisig replaceOwner function
     * @dev emits the removeOwnerEndowment and addOwnerEndowment events
     * @param _owner the owner to be replaced
     */
    function replaceOwner(address _owner, address _newOwner) public override {
        super.replaceOwner(_owner, _newOwner);
        IEndowmentMultiSigEmitter(EMITTER_ADDRESS).removeOwnerEndowment(
            ENDOWMENT_ID,
            _owner
        );
        IEndowmentMultiSigEmitter(EMITTER_ADDRESS).addOwnerEndowment(
            ENDOWMENT_ID,
            _newOwner
        );
    }

    /**
     * @notice overriden the generic multisig changeRequirement function
     * @dev emits the requirementChangeEndowment event
     * @param _required the new required number of signatures
     */
    function changeRequirement(uint256 _required) public override {
        super.changeRequirement(_required);
        IEndowmentMultiSigEmitter(EMITTER_ADDRESS).requirementChangeEndowment(
            ENDOWMENT_ID,
            _required
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
        transactionId = addTransaction(
            title,
            description,
            destination,
            value,
            data,
            metadata
        );
        confirmTransaction(transactionId);
    }

    /**
     * @notice overriden the generic multisig confirmTransaction function
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
     * @notice overriden the generic multisig revokeConfirmation function
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
            MultiSigStorage.Transaction storage txn = transactions[
                transactionId
            ];
            txn.executed = true;
            Utils._execute(
                txn.destination,
                txn.value,
                txn.data
            );
            emit Execution(transactionId);
            IEndowmentMultiSigEmitter(EMITTER_ADDRESS).executeEndowment(
                ENDOWMENT_ID,
                transactionId);      
        }
    }

    /**
     * @notice overriden the generic multisig addTransaction function
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
        transactionId = super.addTransaction(
            title,
            description,
            destination,
            value,
            data,
            metadata
        );
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
