// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../core/struct.sol";
import {Storage, LockedWithdrawStorage} from "./storage.sol";
import {ILockedWithdraw} from "./interfaces/ILockedWithdraw.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Utils} from "../../lib/utils.sol";
import {IEndowmentMultiSigFactory} from "../endowment-multisig/interfaces/IEndowmentMultiSigFactory.sol";
import {IAccountsDepositWithdrawEndowments} from "../../core/accounts/interfaces/IAccountsDepositWithdrawEndowments.sol";

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
     * @param registrar The address of the registrar contract
     * @param accounts The address of the accounts contract
     * @param apteammultisig The address of the AP Team Multisig
     * @param endowfactory The address of the endowment factory
     */
    function initialize(
        address registrar,
        address accounts,
        address apteammultisig,
        address endowfactory
    ) public initializer {
        config.registrar = registrar;
        config.accounts = accounts;
        config.apTeamMultisig = apteammultisig;
        config.endowFactory = endowfactory;
    }

    /**
     * @notice function used to update the config
     * @dev Update the config
     * @param registrar The address of the registrar contract
     * @param accounts The address of the accounts contract
     * @param apteammultisig The address of the AP Team Multisig
     * @param endowfactory The address of the endowment factory
     */
    function updateConfig(
        address registrar,
        address accounts,
        address apteammultisig,
        address endowfactory
    ) public override nonReentrant isApteam {
        if (registrar != address(0)) config.registrar = registrar;
        if (accounts != address(0)) config.accounts = accounts;
        if (apteammultisig != address(0))
            config.apTeamMultisig = apteammultisig;
        if (endowfactory != address(0))
            config.endowFactory = endowfactory;
    }

    /**
     * @notice function used to propose a withdraw
     * @dev Propose a withdraw
     * @param accountId The account id of the endowment
     * @param tokenaddress The address of the token
     * @param amount The amount of the token
     */
    function propose(
        uint32 accountId,
        address tokenaddress,
        uint256 amount
    ) public override nonReentrant isEndowment(accountId) {
        withdrawData[accountId] = LockedWithdrawStorage.Withdraw({
            pending: true,
            tokenAddress: tokenaddress,
            amount: amount
        });

        emit LockedWithdrawInitiated(
            accountId,
            msg.sender,
            tokenaddress,
            amount
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
        IAccountsDepositWithdrawEndowments(config.accounts).withdraw(
            accountId,
            AngelCoreStruct.AccountType.Locked,
            address(0),
            accountId,
            withdrawData[accountId].tokenAddress,
            withdrawData[accountId].amount
        );

        withdrawData[accountId].pending = false;
    }
}
