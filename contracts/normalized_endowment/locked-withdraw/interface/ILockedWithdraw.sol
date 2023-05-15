// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {LockedWithdrawStorage} from "../storage.sol";

abstract contract ILockedWithdraw is IERC165 {
    /*
     * Events
     */
    event LockedWithdrawInitiated(
        uint32 indexed accountId,
        address indexed initiator,
        address[] curTokenaddress,
        uint256[] curAmount
    );
    event LockedWithdrawEndowment(uint32 accountId, address sender);
    event LockedWithdrawAPTeam(uint32 accountId, address sender);
    event LockedWithdrawApproved(
        uint32 indexed accountId,
        address[] curTokenaddress,
        uint256[] curAmount
    );

    event LockedWithdrawRejected(uint256 indexed accountId);

    // approval function for ap team
    function approve(uint32 accountId) public virtual;

    // approval/propose function for endowments
    function propose(
        uint32 accountId,
        address[] memory curTokenaddress,
        uint256[] memory curAmount
    ) public virtual;

    function reject(uint32 accountId) public virtual;

    function updateConfig(
        address curRegistrar,
        address curAccounts,
        address curApteammultisig,
        address curEndowfactory
    ) public virtual;
}
