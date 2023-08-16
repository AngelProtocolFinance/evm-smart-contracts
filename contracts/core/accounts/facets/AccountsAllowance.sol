// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AddressArray} from "../../../lib/address/array.sol";
import {Validator} from "../../validator.sol";
import {AccountStorage} from "../storage.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsAllowance} from "../interfaces/IAccountsAllowance.sol";
import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";

/**
 * @title AccountsAllowance
 * @dev This contract manages the allowances for accounts
 */
contract AccountsAllowance is
  IAccountsAllowance,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMappingAddr
{
  using SafeERC20 for IERC20;
  using AddressArray for address[];

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
      token != address(0) &&
        IterableMappingAddr.get(state.balances[endowId][IVault.VaultType.LIQUID], token) > 0,
      "Invalid Token"
    );

    // Allowlist checks are based around the endowment's maturity status
    bool inAllowlist = false;
    if (tempEndowment.maturityTime == 0 || tempEndowment.maturityTime > block.timestamp) {
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
      inAllowlist = (IterableMappingAddr.get(
        state.allowlists[endowId][LibAccounts.AllowlistType.AllowlistedBeneficiaries],
        spender
      ) == 1);
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
      inAllowlist = (IterableMappingAddr.get(
        state.allowlists[endowId][LibAccounts.AllowlistType.MaturityAllowlist],
        spender
      ) == 1);
    }
    require(inAllowlist, "Spender is not in allowlists");

    uint256 spenderBal = state.ALLOWANCES[endowId][token].bySpender[spender];
    uint256 amountDelta;
    if (amount > spenderBal) {
      amountDelta = amount - spenderBal;
      // check if liquid balance is sufficient for any proposed increase to spender allocation
      require(
        amountDelta <=
          IterableMappingAddr.get(state.balances[endowId][IVault.VaultType.LIQUID], token),
        "Insufficient liquid balance to allocate"
      );
      // increase total outstanding allocation & reduce liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding += amountDelta;
      IterableMappingAddr.decr(
        state.balances[endowId][IVault.VaultType.LIQUID],
        token,
        amountDelta
      );
      emit AllowanceUpdated(endowId, spender, token, amount, amountDelta, 0);
    } else if (amount < spenderBal) {
      amountDelta = spenderBal - amount;
      require(
        amountDelta <= state.ALLOWANCES[endowId][token].totalOutstanding,
        "Insufficient allowances outstanding to cover requested reduction"
      );
      // decrease total outstanding allocation & increase liquid balance by AmountDelta
      state.ALLOWANCES[endowId][token].totalOutstanding -= amountDelta;
      IterableMappingAddr.incr(
        state.balances[endowId][IVault.VaultType.LIQUID],
        token,
        amountDelta
      );
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
