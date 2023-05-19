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
        address tokenaddress,
        uint256 amount
    );
    event LockedWithdrawEndowment(uint32 accountId, address sender);
    event LockedWithdrawAPTeam(uint32 accountId, address sender);
    event LockedWithdrawApproved(
        uint32 indexed accountId,
        address tokenaddress,
        uint256 amount
    );

    event LockedWithdrawRejected(uint32 indexed accountId);

    // approval function for ap team
    function approve(uint32 accountId) public virtual;

    // approval/propose function for endowments
    function propose(
        uint32 accountId,
        address tokenaddress,
        uint256 amount
    ) public virtual;

    function reject(uint32 accountId) public virtual;

    function updateConfig(
        address registrar,
        address accounts,
        address apteammultisig,
        address endowfactory
    ) public virtual;
}
