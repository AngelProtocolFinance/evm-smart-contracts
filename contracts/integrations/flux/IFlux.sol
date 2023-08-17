// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
// Stripped down interface for Flux fTokens
pragma solidity ^0.8.19;

interface IFlux {
  /*** CErc20Interface User Interface ***/

  function mint(uint mintAmount) external returns (uint);

  function redeem(uint redeemTokens) external returns (uint);

  function redeemUnderlying(uint redeemAmount) external returns (uint);

  function borrow(uint borrowAmount) external returns (uint);

  function repayBorrow(uint repayAmount) external returns (uint);

  function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint);

  /*** CTokenInterface User Interface ***/
  function transfer(address dst, uint amount) external returns (bool);

  function transferFrom(address src, address dst, uint amount) external returns (bool);

  function approve(address spender, uint amount) external returns (bool);

  function allowance(address owner, address spender) external view returns (uint);

  function balanceOf(address owner) external view returns (uint);

  function balanceOfUnderlying(address owner) external returns (uint);

  function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint);

  function borrowRatePerBlock() external view returns (uint);

  function supplyRatePerBlock() external view returns (uint);

  function totalBorrowsCurrent() external returns (uint);

  function borrowBalanceCurrent(address account) external returns (uint);

  function borrowBalanceStored(address account) external view returns (uint);

  /**
   * @notice Accrue interest then return the up-to-date exchange rate
   * @return Calculated exchange rate scaled by 1e18
   * Exchange rate == token.supply() / fToken.supply()
   */
  function exchangeRateCurrent() external returns (uint);

  /**
   * @notice Calculates the exchange rate from the underlying to the CToken
   * @dev This function does not accrue interest before calculating the exchange rate
   * @return Calculated exchange rate scaled by 1e18
   * Exchange rate == token.supply() / fToken.supply()
   */
  function exchangeRateStored() external view returns (uint);

  function getCash() external view returns (uint);

  function accrueInterest() external returns (uint);
}
