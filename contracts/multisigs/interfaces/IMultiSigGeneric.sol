// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {MultiSigStorage} from "../storage.sol";

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

abstract contract IMultiSigGeneric is IERC165 {
    /*
     *  Events
     */
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Submission(
        uint256 indexed transactionId,
        MultiSigStorage.Transaction transaction
    );
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint256 required);

    /// @dev Receive function allows to deposit ether.
    receive() external payable virtual;

    /// @dev Fallback function allows to deposit ether.
    fallback() external payable virtual;

    // function initialize(address[] memory owners, uint256 required)
    //     public
    //     virtual;

    /// @dev Allows to add a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of new owner.
    function addOwner(address owner) public virtual;

    /// @dev Allows to remove an owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner.
    function removeOwner(address owner) public virtual;

    /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner to be replaced.
    /// @param newOwner Address of new owner.
    function replaceOwner(address owner, address newOwner) public virtual;

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param required Number of required confirmations.
    function changeRequirement(uint256 required) public virtual;

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @param metadata Encoded transaction metadata, can contain dynamic content.
    /// @return transactionId transaction ID.
    function submitTransaction(
        string memory title,
        string memory description,
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

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint256 transactionId) public virtual;

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint256 transactionId)
        public
        view
        virtual
        returns (bool);

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
        string memory title,
        string memory description,
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
    /// @return count
    function getConfirmationCount(uint256 transactionId)
        public
        view
        virtual
        returns (uint256 count);

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return count Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed)
        public
        view
        virtual
        returns (uint256 count);

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    function getOwners() public view virtual returns (address[] memory);

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return confirmations Returns array of owner addresses.
    function getConfirmations(uint256 transactionId)
        public
        view
        virtual
        returns (address[] memory confirmations);

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return transactionids Returns array of transaction IDs.
    function getTransactionIds(
        uint256 from,
        uint256 to,
        bool pending,
        bool executed
    ) public view virtual returns (uint256[] memory transactionids);
}
