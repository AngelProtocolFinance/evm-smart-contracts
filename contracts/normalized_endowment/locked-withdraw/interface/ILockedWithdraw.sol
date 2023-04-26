// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {LockedWithdrawStorage} from "../storage.sol";

abstract contract ILockedWithdraw is IERC165 {
    /*
     * Events
     */
    event LockedWithdrawInitiated(
        uint256 indexed accountId,
        address indexed initiator,
        address indexed curBeneficiary,
        address[] curTokenaddress,
        uint256[] curAmount
    );
    event LockedWithdrawEndowment(uint256 accountId, address sender);
    event LockedWithdrawAPTeam(uint256 accountId, address sender);
    event LockedWithdrawApproved(
        uint256 indexed accountId,
        address indexed curBeneficiary,
        address[] curTokenaddress,
        uint256[] curAmount
    );

    event LockedWithdrawRejected(uint256 indexed accountId);

    // approval function for ap team
    function approve(uint256 accountId) public virtual;

    // approval/propose function for endowments
    function propose(
        uint256 accountId,
        address curBeneficiary,
        address[] memory curTokenaddress,
        uint256[] memory curAmount
    ) public virtual;

    function reject(uint256 accountId) public virtual;

    function updateConfig(
        address curRegistrar,
        address curAccounts,
        address curApteammultisig,
        address curEndowfactory
    ) public virtual;
}
