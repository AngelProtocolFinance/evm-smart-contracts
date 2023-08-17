// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title AccountsAllowance
 * @dev This contract manages the allowances for accounts
 */
interface IAccountsAllowance {
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
  ) external;

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
  ) external;

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
  ) external view returns (uint256);
}
