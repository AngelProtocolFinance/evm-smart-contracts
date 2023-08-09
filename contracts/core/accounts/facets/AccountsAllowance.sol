// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../../validator.sol";
import {AccountStorage} from "../storage.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsAllowance} from "../interfaces/IAccountsAllowance.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AccountsAllowance
 * @dev This contract manages the allowances for accounts
 */
contract AccountsAllowance is IAccountsAllowance, ReentrancyGuardFacet, IAccountsEvents {
  using SafeERC20 for IERC20;

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
    require(
      token != address(0) && state.STATES[endowId].balances.liquid[token] > 0,
      "Invalid Token"
    );

    // Checks are based around the endowment's maturity time having been reached or not
    bool mature = (tempEndowment.maturityTime != 0 &&
      block.timestamp >= tempEndowment.maturityTime);
    bool inAllowlist = false;
    if (!mature) {
      // Only the endowment owner or a delegate whom controls allowlist can update allowances
      require(
        Validator.canChange(
          tempEndowment.settingsController.allowlistedBeneficiaries,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      // also need to check that the spender address passed is in an allowlist
      for (uint256 i = 0; i < tempEndowment.allowlistedBeneficiaries.length; i++) {
        if (tempEndowment.allowlistedBeneficiaries[i] == spender) {
          inAllowlist = true;
          break;
        }
      }
    } else {
      // Only the endowment owner or a delegate whom controls allowlist can update allowances
      require(
        Validator.canChange(
          tempEndowment.settingsController.maturityAllowlist,
          msg.sender,
          tempEndowment.owner,
          block.timestamp
        ),
        "Unauthorized"
      );
      // also need to check that the spender address passed is in an allowlist
      for (uint256 i = 0; i < tempEndowment.maturityAllowlist.length; i++) {
        if (tempEndowment.maturityAllowlist[i] == spender) {
          inAllowlist = true;
          break;
        }
      }
    }
    require(inAllowlist, "Spender is not in allowlists");

    uint256 spenderBal = state.ALLOWANCES[endowId][token].bySpender[spender];
    uint256 amountDelta;
    if (amount > spenderBal) {
      amountDelta = amount - spenderBal;
      // check if liquid balance is sufficient for any proposed increase to spender allocation
      require(
        amountDelta <= state.STATES[endowId].balances.liquid[token],
        "Insufficient liquid balance to allocate"
      );
      // increase total outstanding allocation & reduce liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding += amountDelta;
      state.STATES[endowId].balances.liquid[token] -= amountDelta;
      emit AllowanceUpdated(endowId, spender, token, amount, amountDelta, 0);
    } else if (amount < spenderBal) {
      amountDelta = spenderBal - amount;
      require(
        amountDelta <= state.ALLOWANCES[endowId][token].totalOutstanding,
        "Insufficient allowances outstanding to cover requested reduction"
      );
      // decrease total outstanding allocation & increase liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding -= amountDelta;
      state.STATES[endowId].balances.liquid[token] += amountDelta;
      emit AllowanceUpdated(endowId, spender, token, amount, 0, amountDelta);
    } else {
      // equal amount and spender balance
      revert("Spender balance equal to amount. No changes needed");
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
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    require(state.ALLOWANCES[endowId][token].totalOutstanding > 0, "Invalid Token");
    require(amount > 0, "Zero Amount");
    require(
      amount <= state.ALLOWANCES[endowId][token].bySpender[msg.sender],
      "Amount requested exceeds Allowance balance"
    );

    state.ALLOWANCES[endowId][token].bySpender[msg.sender] -= amount;
    state.ALLOWANCES[endowId][token].totalOutstanding -= amount;

    IERC20(token).safeTransfer(recipient, amount);
    emit AllowanceSpent(endowId, msg.sender, token, amount);
  }

  /**
   * @notice Query the Allowance for token and spender
   * @dev Query the Allowance for token and spender
   * @param endowId The id of the endowment
   * @param spender The address of the spender
   * @param token The address of the token
   */
  function queryAllowance(
    uint32 endowId,
    address spender,
    address token
  ) external view returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return state.ALLOWANCES[endowId][token].bySpender[spender];
  }
}
