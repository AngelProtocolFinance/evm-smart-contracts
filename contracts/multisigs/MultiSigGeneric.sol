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
    uint256 public constant MAX_OWNER_COUNT = 50;
    /*
     *  Modifiers
     */
    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner]);
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner]);
        _;
    }

    modifier transactionExists(uint256 transactionId) {
        require(transactions[transactionId].destination != address(0));
        _;
    }

    modifier confirmed(uint256 transactionId, address owner) {
        require(confirmations[transactionId][owner]);
        _;
    }

    modifier notConfirmed(uint256 transactionId, address owner) {
        require(!confirmations[transactionId][owner]);
        _;
    }

    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed);
        _;
    }

    modifier notNull(address curAddress) {
        require(curAddress != address(0));
        _;
    }

    modifier validRequirement(uint256 ownerCount, uint256 curRequired) {
        require(
            ownerCount <= MAX_OWNER_COUNT &&
                curRequired <= ownerCount &&
                curRequired != 0 &&
                ownerCount != 0
        );
        _;
    }

    /// @dev Receive function allows to deposit ether.
    receive() external payable override {
        if (msg.value > 0) emit Deposit(msg.sender, msg.value);
    }

    /// @dev Fallback function allows to deposit ether.
    fallback() external payable override {
        if (msg.value > 0) emit Deposit(msg.sender, msg.value);
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param curOwners List of initial owners.
    /// @param curRequired Number of required confirmations.
    function initialize(
        address[] memory curOwners,
        uint256 curRequired,
        bool curRequireexecution
    ) public virtual initializer validRequirement(curOwners.length, curRequired) {
        for (uint256 i = 0; i < curOwners.length; i++) {
            require(!isOwner[curOwners[i]] && curOwners[i] != address(0));
            isOwner[curOwners[i]] = true;
        }
        owners = curOwners;
        required = curRequired;
        requireExecution = curRequireexecution;
    }

    /// @dev Allows to add a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of new owner.
    function addOwner(address owner)
        public
        virtual
        override
        onlyWallet
        ownerDoesNotExist(owner)
        notNull(owner)
        validRequirement(owners.length + 1, required)
    {
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAddition(owner);
    }

    /// @dev Allows to remove an owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner.
    function removeOwner(address owner)
        public
        virtual
        override
        onlyWallet
        ownerExists(owner)
    {
        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length - 1; i++)
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        // TODO check if pops from back
        owners.pop();
        if (required > owners.length) changeRequirement(owners.length);
        emit OwnerRemoval(owner);
    }

    /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner to be replaced.
    /// @param newOwner Address of new owner.
    function replaceOwner(address owner, address newOwner)
        public
        virtual
        override
        onlyWallet
        ownerExists(owner)
        ownerDoesNotExist(newOwner)
    {
        for (uint256 i = 0; i < owners.length; i++)
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        emit OwnerRemoval(owner);
        emit OwnerAddition(newOwner);
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param curRequired Number of required confirmations.
    function changeRequirement(uint256 curRequired)
        public
        virtual
        override
        onlyWallet
        validRequirement(owners.length, curRequired)
    {
        required = curRequired;
        emit RequirementChange(curRequired);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param title title related to txn
    /// @param description description related to txn
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

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint256 transactionId)
        public
        virtual
        override
        nonReentrant
        ownerExists(msg.sender)
        transactionExists(transactionId)
        notConfirmed(transactionId, msg.sender)
    {
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        // if execution is required, do not auto execute
        if (!requireExecution) {
            executeTransaction(transactionId);
        }
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint256 transactionId)
        public
        virtual
        override
        nonReentrant
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        emit Revocation(msg.sender, transactionId);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint256 transactionId)
        public
        virtual
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
        }
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint256 transactionId)
        public
        view
        override
        returns (bool)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) count += 1;
            if (count == required) return true;
        }
        return false;
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param title title for submitted transaction
    /// @param description description for submitted transaction.
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
    )
        internal
        virtual
        override
        notNull(destination)
        returns (uint256 transactionId)
    {
        transactionId = transactionCount;
        transactions[transactionId] = MultiSigStorage.Transaction({
            title: title,
            description: description,
            destination: destination,
            value: value,
            data: data,
            executed: false,
            metadata: metadata
        });
        transactionCount += 1;
        emit Submission(transactionId, transactions[transactionId]);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return count
    function getConfirmationCount(uint256 transactionId)
        public
        view
        override
        returns (uint256 count)
    {
        for (uint256 i = 0; i < owners.length; i++)
            if (confirmations[transactionId][owners[i]]) count += 1;
    }

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return count Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed)
        public
        view
        override
        returns (uint256 count)
    {
        for (uint256 i = 0; i < transactionCount; i++)
            if (
                (pending && !transactions[i].executed) ||
                (executed && transactions[i].executed)
            ) count += 1;
    }

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    function getOwners() public view override returns (address[] memory) {
        return owners;
    }

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return curConfirmations Returns array of owner addresses.
    function getConfirmations(uint256 transactionId)
        public
        view
        override
        returns (address[] memory curConfirmations)
    {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < owners.length; i++)
            if (confirmations[transactionId][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        curConfirmations = new address[](count);
        for (i = 0; i < count; i++) curConfirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return curTransactionids Returns array of transaction IDs.
    function getTransactionIds(
        uint256 from,
        uint256 to,
        bool pending,
        bool executed
    ) public view override returns (uint256[] memory curTransactionids) {
        uint256[] memory transactionIdsTemp = new uint256[](transactionCount);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < transactionCount; i++)
            if (
                (pending && !transactions[i].executed) ||
                (executed && transactions[i].executed)
            ) {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        curTransactionids = new uint256[](to - from);
        for (i = from; i < to; i++)
            curTransactionids[i - from] = transactionIdsTemp[i];
    }
}
