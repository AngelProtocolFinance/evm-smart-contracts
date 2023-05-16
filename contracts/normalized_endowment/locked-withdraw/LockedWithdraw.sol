// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../core/struct.sol";
import {Storage, LockedWithdrawStorage} from "./storage.sol";
import {ILockedWithdraw} from "./interface/ILockedWithdraw.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Utils} from "../../lib/utils.sol";
import {IEndowmentMultiSigFactory} from "../endowment-multisig/interface/IEndowmentMultiSigFactory.sol";

/**
 * @title LockedWithdraw
 * @dev This contract is used to withdraw locked funds from the accounts
 * @dev Can be used only by charities to emergency withdraw locked funds
 */
contract LockedWithdraw is
    Storage,
    ILockedWithdraw,
    ERC165,
    Initializable,
    ReentrancyGuard
{
    /*
     * Modifiers
     */

    modifier isEndowment(uint32 accountId) {
        require(
            IEndowmentMultiSigFactory(config.endowFactory)
                .endowmentIdToMultisig(accountId) == msg.sender,
            "Unauthorized"
        );
        _;
    }

    modifier isApteam() {
        require(config.apTeamMultisig == msg.sender, "Unauthorized");
        _;
    }

    //TODO: not used so commented it out
    // modifier isEndowFactory() {
    //     require(config.endowFactory == msg.sender, "Unauthorized");
    //     _;
    // }

    modifier isPending(uint32 accountId) {
        require(withdrawData[accountId].pending == true, "Pending Txns");
        _;
    }

    // modifier isNotPending(uint32 accountId) {
    //     require(withdrawData[accountId].pending == false, "No Txns");
    //     _;
    // }

    /**
     * @notice function used to initialize the contract
     * @dev Initialize the contract
     * @param curRegistrar The address of the registrar contract
     * @param curAccounts The address of the accounts contract
     * @param curApteammultisig The address of the AP Team Multisig
     * @param curEndowfactory The address of the endowment factory
     */
    function initialize(
        address curRegistrar,
        address curAccounts,
        address curApteammultisig,
        address curEndowfactory
    ) public initializer {
        config.registrar = curRegistrar;
        config.accounts = curAccounts;
        config.apTeamMultisig = curApteammultisig;
        config.endowFactory = curEndowfactory;
    }

    /**
     * @notice function used to update the config
     * @dev Update the config
     * @param curRegistrar The address of the registrar contract
     * @param curAccounts The address of the accounts contract
     * @param curApteammultisig The address of the AP Team Multisig
     * @param curEndowfactory The address of the endowment factory
     */
    function updateConfig(
        address curRegistrar,
        address curAccounts,
        address curApteammultisig,
        address curEndowfactory
    ) public override nonReentrant isApteam {
        if (curRegistrar != address(0)) config.registrar = curRegistrar;
        if (curAccounts != address(0)) config.accounts = curAccounts;
        if (curApteammultisig != address(0))
            config.apTeamMultisig = curApteammultisig;
        if (curEndowfactory != address(0))
            config.endowFactory = curEndowfactory;
    }

    /**
     * @notice function used to propose a withdraw
     * @dev Propose a withdraw
     * @param accountId The account id of the endowment
     * @param curTokenaddress The address of the token
     * @param curAmount The amount of the token
     */
    function propose(
        uint32 accountId,
        address[] memory curTokenaddress,
        uint256[] memory curAmount
    ) public override nonReentrant isEndowment(accountId) {
        withdrawData[accountId] = LockedWithdrawStorage.Withdraw({
            pending: true,
            tokenAddress: curTokenaddress,
            amount: curAmount
        });

        emit LockedWithdrawInitiated(
            accountId,
            msg.sender,
            curTokenaddress,
            curAmount
        );

        emit LockedWithdrawEndowment(accountId, msg.sender);
    }

    /**
     * @notice function used to reject a withdraw
     * @dev Reject a withdraw to free endowment to add another locked request
     */
    function reject(
        uint32 accountId
    ) public override nonReentrant isApteam isPending(accountId) {
        emit LockedWithdrawRejected(accountId);
        withdrawData[accountId].pending = false;
    }

    /**
     * @notice function used to approve a withdraw
     * @dev Approve a withdraw (called from the ap team multisg)
     * @param accountId The account id of the endowment
     */
    function approve(
        uint32 accountId
    ) public override nonReentrant isApteam isPending(accountId) {
        emit LockedWithdrawAPTeam(accountId, msg.sender);

        emit LockedWithdrawApproved(
            accountId,
            withdrawData[accountId].tokenAddress,
            withdrawData[accountId].amount
        );

        // execute withdraw
        _executeWithdraw(accountId);

        withdrawData[accountId].pending = false;
    }

    /**
     * @notice internal function used to execute withdraw message on accounts
     * @dev Execute withdraw message on accounts (internal function)
     * @param accountId The account id of the endowment
     */
    function _executeWithdraw(uint32 accountId) internal {
        Utils._execute(config.accounts, 0, abi.encodeWithSignature(
            "withdraw(uint32,uint8,address,uint32,address[],uint256[])",
            accountId,
            AngelCoreStruct.AccountType.Locked,
            address(0),
            accountId,
            withdrawData[accountId].tokenAddress,
            withdrawData[accountId].amount
        ));
    }
}
