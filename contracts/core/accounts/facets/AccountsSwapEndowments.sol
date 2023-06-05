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
     * @param tokenIn The address of the token to be swapped
     * @param amountIn The amount of tokens to be swapped in
     * @param tokenOut The address of the token to be received out
     */
    function swapToken(
        uint32 id,
        AngelCoreStruct.AccountType accountType,
        address tokenIn,
        uint256 amountIn,
        address tokenOut
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();


        require(amountIn > 0, "Invalid Swap Input: Zero Amount");
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid Swap Input: Zero Address");
        // Check that the desired output token from the swap is either:
        // A. In the protocol-level accepted tokens list in the Registrar Contract OR
        // B. In the endowment-level accepted tokens list
        require(
            IRegistrar(state.config.registrarContract).isTokenAccepted(tokenOut) ||
            state.AcceptedTokens[id][tokenOut],
            "Output token not in an Accepted Tokens List"
        );

        // check if the msg sender is either the owner or their delegate address and
        // that they have the power to manage the investments for an account balance
        if (accountType == AngelCoreStruct.AccountType.Locked) {
            require(AngelCoreStruct.canChange(
                state.ENDOWMENTS[id].settingsController.lockedInvestmentManagement,
                msg.sender,
                state.ENDOWMENTS[id].owner,
                block.timestamp
            ), "Unauthorized");
        } else if (accountType == AngelCoreStruct.AccountType.Locked) {
            require(AngelCoreStruct.canChange(
                state.ENDOWMENTS[id].settingsController.liquidInvestmentManagement,
                msg.sender,
                state.ENDOWMENTS[id].owner,
                block.timestamp
            ), "Unauthorized");
        }

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            IERC20(tokenIn).balanceOf(address(this)) >= amountIn,
            "BalanceTooSmall"
        );

        if (accountType == AngelCoreStruct.AccountType.Locked) {
            state.STATES[id].balances.locked.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.locked.balancesByToken[tokenIn],
                    amountIn
                );
        } else {
            state.STATES[id].balances.liquid.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.liquid.balancesByToken[tokenIn],
                    amountIn
                );
        }

        require(
            IERC20(tokenIn).approve(registrar_config.swapsRouter, amountIn),
            "Approve failed"
        );

        uint256 amountOut = ISwappingV3(registrar_config.swapsRouter)
            .executeSwaps(
                tokenIn,
                amountIn,
                tokenOut,
                0 // TODO: this will revert whenever swap_amount > 0
            );

        updateStateBalance(id, tokenOut, amountOut, accountType);
        emit SwapToken(
            id,
            accountType,
            tokenIn,
            amountIn,
            tokenOut,
            amountOut
        );
    }

    /**
     * @notice This function updates the state balance of the endowment
     * @dev updates the state balance of the endowment based on account type
     * @param id The id of the endowment
     * @param tokenAddress The address of the token
     * @param amount The amount of tokens
     * @param accountType The type of the account
     */
    function updateStateBalance(
        uint32 id,
        address tokenAddress,
        uint256 amount,
        AngelCoreStruct.AccountType accountType
    ) internal {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        if (accountType == AngelCoreStruct.AccountType.Locked) {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.locked,
                tokenAddress,
                amount
            );
        } else {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.liquid,
                tokenAddress,
                amount
            );
        }
    }
}
