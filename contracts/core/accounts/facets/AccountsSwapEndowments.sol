// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {ISwappingV3} from "../../swap-router/interfaces/ISwappingV3.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AccountsSwapEndowments
 * @dev This contract manages the swaps for endowments
 */
contract AccountsSwapEndowments is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice This function swaps tokens for an endowment
     * @dev This function swaps tokens for an endowment
     * @param id The id of the endowment
     * @param accountType The type of the account
     * @param amount The amount of tokens to be swapped
     * @param tokenIn The address of the token to be swapped
     * @param tokenOut The address of the token to be received
     */
    function swapToken(
        uint32 id,
        AngelCoreStruct.AccountType accountType,
        uint256 amount,
        address tokenIn,
        address tokenOut
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[id];

        require(tempEndowment.owner == msg.sender, "Unauthorized");
        require(amount > 0, "InvalidInputs");
        require(tokenIn != address(0), "InvalidInputs");
        require(tokenOut != address(0), "InvalidInputs");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            IERC20(tokenIn).balanceOf(address(this)) >= amount,
            "BalanceTooSmall"
        );

        if (accountType == AngelCoreStruct.AccountType.Locked) {
            state.STATES[id].balances.locked.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.locked.balancesByToken[tokenIn],
                    amount
                );
        } else {
            state.STATES[id].balances.liquid.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.liquid.balancesByToken[tokenIn],
                    amount
                );
        }

        require(
            IERC20(tokenIn).approve(registrar_config.swapsRouter, amount),
            "Approve failed"
        );

        uint256 output = ISwappingV3(registrar_config.swapsRouter)
            .executeSwapOperations(
                tokenIn,
                tokenOut,
                amount,
                0 // TODO: this will revert whenever swap_amount > 0
            );

        updateStateBalance(id, tokenOut, output, accountType);
        // emit UpdateEndowmentState(id, tempState);
        emit SwapToken(
            id,
            accountType,
            amount,
            tokenIn,
            tokenOut,
            0
        );
    }

    /**
     * @notice This function updates the state balance of the endowment
     * @dev updates the state balance of the endowment based on account type
     * @param id The id of the endowment
     * @param tokenaddress The address of the token
     * @param amount The amount of tokens
     * @param accountType The type of the account
     */
    function updateStateBalance(
        uint32 id,
        address tokenaddress,
        uint256 amount,
        AngelCoreStruct.AccountType accountType
    ) internal {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        if (accountType == AngelCoreStruct.AccountType.Locked) {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.locked,
                tokenaddress,
                amount
            );
        } else {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.liquid,
                tokenaddress,
                amount
            );
        }
    }
}
