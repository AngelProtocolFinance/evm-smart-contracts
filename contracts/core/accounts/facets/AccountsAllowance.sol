// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsAllowance
 * @dev This contract manages the allowances for accounts
 */
contract AccountsAllowance is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice Endowment owner adds allowance to spend
     * @dev This function adds or removes allowances for an account
     * @param curId The id of the endowment
     * @param curAction The action to be performed
     * @param curSpender The address of the spender
     * @param curAllowance The allowance data
     * @param curTokenaddress The address of the token
     */
    function manageAllowances(
        uint256 curId,
        string memory curAction,
        address curSpender,
        AccountStorage.AllowanceData memory curAllowance,
        address curTokenaddress
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[curId];

        require((msg.sender == tempEndowment.owner), "Unauthorized");

        if (curAllowance.expires) {
            require(block.number > curAllowance.height, "Expired");
            require(block.timestamp > curAllowance.timestamp, "Expired");
        }

        require(curSpender != address(0), "Invalid Spender");
        require(curTokenaddress != address(0), "Invalid Token");

        if (
            keccak256(abi.encodePacked("add")) ==
            keccak256(abi.encodePacked(curAction)) &&
            state.ALLOWANCES[msg.sender][curSpender][curTokenaddress].configured
        ) {
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .allowanceAmount += curAllowance.allowanceAmount;
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .configured = true;
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .height = curAllowance.height;
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .timestamp = curAllowance.timestamp;
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .expires = curAllowance.expires;
            emit AllowanceStateUpdatedTo(
                msg.sender,
                curSpender,
                curTokenaddress,
                state.ALLOWANCES[msg.sender][curSpender][curTokenaddress]
            );
        } else if (
            keccak256(abi.encodePacked("add")) ==
            keccak256(abi.encodePacked(curAction))
        ) {
            state.ALLOWANCES[msg.sender][curSpender][
                curTokenaddress
            ] = curAllowance;
            state
            .ALLOWANCES[msg.sender][curSpender][curTokenaddress]
                .configured = true;
            emit AllowanceStateUpdatedTo(
                msg.sender,
                curSpender,
                curTokenaddress,
                state.ALLOWANCES[msg.sender][curSpender][curTokenaddress]
            );
        } else if (
            keccak256(abi.encodePacked("remove")) ==
            keccak256(abi.encodePacked(curAction)) &&
            state.ALLOWANCES[msg.sender][curSpender][curTokenaddress].configured
        ) {
            delete state.ALLOWANCES[msg.sender][curSpender][curTokenaddress];
            emit RemoveAllowance(msg.sender, curSpender, curTokenaddress);
        } else {
            revert("Invalid Operation");
        }
    }

    /**
     * @notice withdraw the funds user has granted the allowance for
     * @dev This function spends the allowance of an account
     * @param curId The id of the endowment
     * @param curTokenAddress The address of the token
     * @param curAmount The amount to be spent
     */
    function spendAllowance(
        uint256 curId,
        address curTokenAddress,
        uint256 curAmount,
        address curRecipient
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        require(curTokenAddress != address(0), "Invalid token address");
        require(curAmount != 0, "Invalid amount");
        require(curAmount < state.STATES[curId].balances.liquid.balancesByToken[curTokenAddress], "Insufficient Funds");

        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[curId];
        address spender = msg.sender;
        address owner = tempEndowment.owner;

        require(
            state.ALLOWANCES[owner][spender][curTokenAddress].configured,
            "NoAllowance"
        );

        if (state.ALLOWANCES[owner][spender][curTokenAddress].expires) {
            require(
                state.ALLOWANCES[owner][spender][curTokenAddress].height <
                    block.number,
                "Expired"
            );
            require(
                state.ALLOWANCES[owner][spender][curTokenAddress].timestamp <
                    block.timestamp,
                "Expired"
            );
        }

        require(
            state.ALLOWANCES[owner][spender][curTokenAddress].allowanceAmount >
                curAmount,
            "NoAllowance"
        );

        state.ALLOWANCES[owner][spender][curTokenAddress]
            .allowanceAmount -= curAmount;

        state.STATES[curId].balances.liquid.balancesByToken[curTokenAddress] -= curAmount;

        require(
            IERC20(curTokenAddress).transfer(curRecipient, curAmount),
            "Transfer failed"
        );
    }
}
