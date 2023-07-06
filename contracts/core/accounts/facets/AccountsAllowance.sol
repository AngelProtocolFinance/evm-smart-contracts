// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../../validator.sol";
import {AccountStorage} from "../storage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsAllowance} from "../interfaces/IAccountsAllowance.sol";

/**
 * @title AccountsAllowance
 * @dev This contract manages the allowances for accounts
 */
contract AccountsAllowance is IAccountsAllowance, ReentrancyGuardFacet, IAccountsEvents {
  /**
   * @notice Endowment owner adds allowance to spend
   * @dev This function adds or removes allowances for an account
   * @param endowId The id of the endowment
   * @param spender The address of the spender
   * @param token The address of the token
   * @param amount The allowance amount
   */
  function manageAllowances(
    uint32 endowId,
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
        Validator.canChange(
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
        Validator.canChange(
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

    uint256 amountDelta;
    uint256 currSpenderBal = state.ALLOWANCES[endowId][token].bySpender[spender];
    if (amount > currSpenderBal) {
      amountDelta = amount - currSpenderBal;
      // check if liquid balance is sufficient for any proposed increase to spender allocation
      require(
        state.STATES[endowId].balances.liquid[token] >= amountDelta,
        "Insufficient liquid balance to allocate"
      );
      // increase total outstanding allocation & reduce liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding += amountDelta;
      state.STATES[endowId].balances.liquid[token] -= amountDelta;
      emit AllowanceUpdated(endowId, spender, token, amount, amountDelta, 0);
    } else if (amount < currSpenderBal) {
      amountDelta = currSpenderBal - amount;
      // decrease total outstanding allocation & increase liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding -= amountDelta;
      state.STATES[endowId].balances.liquid[token] += amountDelta;
      emit AllowanceUpdated(endowId, spender, token, amount, 0, amountDelta);
    }
    // set the allocation for spender to the amount specified
    state.ALLOWANCES[endowId][token].bySpender[spender] = amount;
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
    require(state.ALLOWANCES[endowId][token].bySpender[msg.sender] > 0, "Allowance does not exist");
    require(
      state.ALLOWANCES[endowId][token].bySpender[msg.sender] >= amount,
      "Amount requested exceeds Allowance balance"
    );

    state.ALLOWANCES[endowId][token].bySpender[msg.sender] -= amount;
    state.ALLOWANCES[endowId][token].totalOutstanding -= amount;

    require(IERC20(token).transfer(recipient, amount), "Transfer failed");
    emit AllowanceSpent(endowId, msg.sender, token, amount);
  }
}
