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
     * @param curToken The address of the token
     * @param curAmount The allowance amount
     */
    function manageAllowances(
        uint32 curId,
        string memory curAction,
        address curSpender,
        address curToken,
        uint256 curAmount
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();
        AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[curId];

        require(!state.STATES[curId].closingEndowment, "Endowment is closed");
        require(curToken != address(0), "Invalid Token");
        require(keccak256(abi.encodePacked("add")) ==
            keccak256(abi.encodePacked(curAction)) || keccak256(abi.encodePacked("remove")) ==
            keccak256(abi.encodePacked(curAction)), "Invalid Operation");

        // Only the endowment owner or a delegate whom controls the appropriate allowlist can update allowances
        // Allowances are additionally restricted to existing allowlisted addresses
        bool inAllowlist = false;
        if (tempEndowment.maturityTime >= block.timestamp) {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.allowlistedBeneficiaries,
                msg.sender,
                tempEndowment.owner,
                block.timestamp), "Unauthorized");
            for (uint8 i = 0; i < tempEndowment.allowlistedBeneficiaries.length; i++) {
                if (tempEndowment.allowlistedBeneficiaries[i] == curSpender) {
                    inAllowlist = true;
                    break;
                }
            }
        } else {
            require(AngelCoreStruct.canChange(
                tempEndowment.settingsController.maturityAllowlist,
                msg.sender,
                tempEndowment.owner,
                block.timestamp), "Unauthorized");
            for (uint8 i = 0; i < tempEndowment.maturityAllowlist.length; i++) {
                if (tempEndowment.maturityAllowlist[i] == curSpender) {
                    inAllowlist = true;
                    break;
                }
            }
        }
        require(inAllowlist, "Invalid Spender");

        if (
            keccak256(abi.encodePacked("remove")) ==
            keccak256(abi.encodePacked(curAction))
        ) {
            delete state.ALLOWANCES[curId][curSpender][curToken];
            emit RemoveAllowance(msg.sender, curSpender, curToken);
        } else if (
            keccak256(abi.encodePacked("add")) ==
            keccak256(abi.encodePacked(curAction))
        ) {
            require(curAmount > 0, "Zero amount");
            state.ALLOWANCES[curId][curSpender][curToken] = curAmount;
            emit AllowanceStateUpdatedTo(
                msg.sender,
                curSpender,
                curToken,
                state.ALLOWANCES[curId][curSpender][curToken]
            );
        }
    }

    /**
     * @notice withdraw the funds user has granted the allowance for
     * @dev This function spends the allowance of an account
     * @param curId The id of the endowment
     * @param curToken The address of the token
     * @param curAmount The amount to be spent
     */
    function spendAllowance(
        uint32 curId,
        address curToken,
        uint256 curAmount
    ) public nonReentrant {
        require(curToken != address(0), "Invalid token address");
        require(curAmount != 0, "Zero Amount");

        AccountStorage.State storage state = LibAccounts.diamondStorage();
        require(state.ALLOWANCES[curId][msg.sender][curToken] > 0, "Allowance does not exist");
        require(
            state.ALLOWANCES[curId][msg.sender][curToken] > curAmount,
            "Amount reqested exceeds allowance balance"
        );
        require(curAmount < state.STATES[curId].balances.liquid.balancesByToken[curToken], "InsufficientFunds");

        state.ALLOWANCES[curId][msg.sender][curToken] -= curAmount;
        state.STATES[curId].balances.liquid.balancesByToken[curToken] -= curAmount;

        require(
            IERC20(curToken).transfer(msg.sender, curAmount),
            "Transfer failed"
        );
    }
}
