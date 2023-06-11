// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";
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
   * @param endowId The id of the endowment
   * @param action The action to be performed
   * @param spender The address of the spender
   * @param token The address of the token
   * @param amount The allowance amount
   */
  function manageAllowances(
    uint32 endowId,
    AngelCoreStruct.AllowanceAction action,
    address spender,
    address token,
    uint256 amount
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[endowId];

    require(!state.STATES[endowId].closingEndowment, "Endowment is closed");
    require(token != address(0), "Invalid Token");

    // Only the endowment owner or a delegate whom controls the appropriate allowlist can update allowances
    // Allowances are additionally restricted to existing allowlisted addresses
    bool inAllowlist = false;
    if (tempEndowment.maturityTime >= block.timestamp) {
      require(
        AngelCoreStruct.canChange(
          tempEndowment.settingsController.allowlistedBeneficiaries,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      for (uint256 i = 0; i < tempEndowment.allowlistedBeneficiaries.length; i++) {
        if (tempEndowment.allowlistedBeneficiaries[i] == spender) {
          inAllowlist = true;
          break;
        }
      }
    } else {
      require(
        AngelCoreStruct.canChange(
          tempEndowment.settingsController.maturityAllowlist,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      for (uint256 i = 0; i < tempEndowment.maturityAllowlist.length; i++) {
        if (tempEndowment.maturityAllowlist[i] == spender) {
          inAllowlist = true;
          break;
        }
      }
    }
    require(inAllowlist, "Invalid Spender");

    if (action == AngelCoreStruct.AllowanceAction.Remove) {
      delete state.ALLOWANCES[endowId][spender][token];
      emit RemoveAllowance(msg.sender, spender, token);
    } else if (action == AngelCoreStruct.AllowanceAction.Add) {
      require(amount > 0, "Zero amount");
      state.ALLOWANCES[endowId][spender][token] = amount;
      emit AllowanceStateUpdatedTo(
        msg.sender,
        spender,
        token,
        state.ALLOWANCES[endowId][spender][token]
      );
    } else {
      revert("Invalid Operation");
    }
  }

  /**
   * @notice withdraw the funds user has granted the allowance for
   * @dev This function spends the allowance of an account
   * @param endowId The id of the endowment
   * @param token The address of the token
   * @param amount The amount to be spent
   * @param recipient The recipient of the spend
   */
  function spendAllowance(
    uint32 endowId,
    address token,
    uint256 amount,
    address recipient
  ) public nonReentrant {
    require(token != address(0), "Invalid token address");
    require(recipient != address(0), "Invalid recipient address");
    require(amount != 0, "Zero Amount");

    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(state.ALLOWANCES[endowId][msg.sender][token] > 0, "Allowance does not exist");
    require(
      state.ALLOWANCES[endowId][msg.sender][token] > amount,
      "Amount reqested exceeds allowance balance"
    );
    require(
      amount < state.STATES[endowId].balances.liquid.balancesByToken[token],
      "InsufficientFunds"
    );

    state.ALLOWANCES[endowId][msg.sender][token] -= amount;
    state.STATES[endowId].balances.liquid.balancesByToken[token] -= amount;

    require(IERC20(token).transfer(recipient, amount), "Transfer failed");
  }
}
