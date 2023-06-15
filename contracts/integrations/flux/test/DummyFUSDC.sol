// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IFlux} from "../IFlux.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DummyFUSDC is IFlux, ERC20 {
  
  ERC20 underlying;
  uint256 responseAmt;
  uint256 exRate; 

  constructor(address _underlying) ERC20("fUSDC", "fUSDC") {
    underlying = ERC20(_underlying);
  }

  /*//////////////////////////////////////////////////////////////
                        TEST HELPERS
  //////////////////////////////////////////////////////////////*/
  function setResponseAmt(uint256 _amt) external {
    responseAmt = _amt;
  }
  function setExRate(uint256 _exRate) external {
    exRate = _exRate;
  } 

  /*//////////////////////////////////////////////////////////////
                        METHODS USED IN INTEGRATION
  //////////////////////////////////////////////////////////////*/
  function mint(uint mintAmount) external  returns (uint) {
    underlying.transferFrom(msg.sender, address(this), mintAmount);
    _mint(msg.sender, responseAmt);
  }

  function redeem(uint redeemTokens) external  returns (uint) {
    _burn(msg.sender, redeemTokens);
    underlying.transfer(msg.sender, responseAmt);
  }

  /**
   * @notice Calculates the exchange rate from the underlying to the CToken
   * @dev This function does not accrue interest before calculating the exchange rate
   * @return Calculated exchange rate scaled by 1e18
   * Exchange rate == token.supply() / fToken.supply()
   */
  function exchangeRateStored() external view  returns (uint) {
    return exRate;
  }

  /*//////////////////////////////////////////////////////////////
                  IFACE METHODS SHARED WITH ERC20 
  //////////////////////////////////////////////////////////////*/
  function allowance(address owner, address spender) public view override(IFlux,ERC20) returns (uint256) {
    return super.allowance(owner,spender);
  }

  function approve(address spender, uint256 amount) public override(IFlux,ERC20) returns (bool) {
    return super.approve(spender, amount);
  } 

  function balanceOf(address account) public view override(IFlux,ERC20) returns (uint256) {
    return super.balanceOf(account); 
  } 

  function transfer(address to, uint256 amount) public override(IFlux,ERC20) returns (bool) {
    return super.transfer(to, amount);
  }

  function transferFrom(
        address from,
        address to,
        uint256 amount
  ) public override(IFlux,ERC20) returns (bool) {
      return super.transferFrom(from, to, amount);
  }

  /*//////////////////////////////////////////////////////////////
                      UNUSED IFACE METHODS 
  //////////////////////////////////////////////////////////////*/
  function redeemUnderlying(uint redeemAmount) external  returns (uint) {}

  function borrow(uint borrowAmount) external  returns (uint) {}

  function repayBorrow(uint repayAmount) external  returns (uint) {}

  function repayBorrowBehalf(
    address borrower,
    uint repayAmount
  ) external  returns (uint) {}

  function balanceOfUnderlying(address owner) external  returns (uint) {}

  function getAccountSnapshot(
    address account
  ) external view  returns (uint, uint, uint, uint) {}

  function borrowRatePerBlock() external view  returns (uint) {}

  function supplyRatePerBlock() external view  returns (uint) {}

  function totalBorrowsCurrent() external  returns (uint) {}

  function borrowBalanceCurrent(
    address account
  ) external  returns (uint) {}

  function borrowBalanceStored(
    address account
  ) external view  returns (uint) {}

  function exchangeRateCurrent() external  returns (uint) {}

  function getCash() external view  returns (uint) {}

  function accrueInterest() external  returns (uint) {}
}