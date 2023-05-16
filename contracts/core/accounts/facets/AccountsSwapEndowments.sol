// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import {ISwappingV3} from "../../swap-router/Interface/ISwappingV3.sol";
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
     * @param curId The id of the endowment
     * @param curAccountType The type of the account
     * @param curAmount The amount of tokens to be swapped
     * @param curTokenin The address of the token to be swapped
     * @param curTokenout The address of the token to be received
     */
    function swapToken(
        uint256 curId,
        AngelCoreStruct.AccountType curAccountType,
        uint256 curAmount,
        address curTokenin,
        address curTokenout
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[curId];
        // AccountStorage.Config memory tempConfig = state.config;
        AccountStorage.EndowmentState memory tempState = state.STATES[curId];

        require(tempEndowment.owner == msg.sender, "Unauthorized");

        require(curAmount > 0, "InvalidInputs");
        require(curTokenin != address(0), "InvalidInputs");
        require(curTokenout != address(0), "InvalidInputs");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            IERC20(curTokenin).balanceOf(address(this)) >= curAmount,
            "BalanceTooSmall"
        );

        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            tempState.balances.locked.Cw20CoinVerified_amount = AngelCoreStruct
                .deductTokens(
                    tempState.balances.locked.Cw20CoinVerified_addr,
                    tempState.balances.locked.Cw20CoinVerified_amount,
                    curTokenin,
                    curAmount
                );
        } else {
            tempState.balances.liquid.Cw20CoinVerified_amount = AngelCoreStruct
                .deductTokens(
                    tempState.balances.liquid.Cw20CoinVerified_addr,
                    tempState.balances.liquid.Cw20CoinVerified_amount,
                    curTokenin,
                    curAmount
                );
        }

        require(
            IERC20(curTokenin).approve(registrar_config.swapsRouter, curAmount),
            "Approve failed"
        );

        uint256[] memory curAmountin = new uint256[](1);
        curAmountin[0] = curAmount;

        address[] memory curArrayin = new address[](1);
        curArrayin[0] = curTokenin;

        uint256 output = ISwappingV3(registrar_config.swapsRouter)
            .executeSwapOperations(
                curArrayin,
                curTokenout,
                curAmountin,
                0 // TODO: this will revert whenever swap_amount > 0
            );
        state.STATES[curId] = tempState;

        updateStateBalance(curId, curTokenout, output, curAccountType);
        emit UpdateEndowmentState(curId, tempState);
        emit SwapToken(
            curId,
            curAccountType,
            curAmount,
            curTokenin,
            curTokenout,
            0
        );
    }

    /**
     * @notice This function updates the state balance of the endowment
     * @dev updates the state balance of the endowment based on account type
     * @param curId The id of the endowment
     * @param curTokenaddress The address of the token
     * @param curAmount The amount of tokens
     * @param curAccountType The type of the account
     */
    function updateStateBalance(
        uint256 curId,
        address curTokenaddress,
        uint256 curAmount,
        AngelCoreStruct.AccountType curAccountType
    ) internal {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        if (curAccountType == AngelCoreStruct.AccountType.Locked) {
            AngelCoreStruct.addToken(
                state.STATES[curId].balances.locked,
                curTokenaddress,
                curAmount
            );
        } else {
            AngelCoreStruct.addToken(
                state.STATES[curId].balances.liquid,
                curTokenaddress,
                curAmount
            );
        }
    }
}
