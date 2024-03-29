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
  bool approveAllowed = true;
  bool transferAllowed = true;
  bool mintAllowed = true;
  bool redeemAllowed = true;

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

  function setApproveAllowed(bool _allowed) external {
    approveAllowed = _allowed;
  }

  function setTransferAllowed(bool _allowed) external {
    transferAllowed = _allowed;
  }

  function setMintAllowed(bool _allowed) external {
    mintAllowed = _allowed;
  }

  function setRedeemAllowed(bool _allowed) external {
    redeemAllowed = _allowed;
  }

  /*//////////////////////////////////////////////////////////////
                        METHODS USED IN INTEGRATION
  //////////////////////////////////////////////////////////////*/
  function mint(uint mintAmount) external returns (uint) {
    if (!mintAllowed) {
      revert();
    }
    underlying.transferFrom(msg.sender, address(this), mintAmount);
    _mint(msg.sender, responseAmt);
    return responseAmt;
  }

  function redeem(uint redeemTokens) external returns (uint) {
    if (!redeemAllowed) {
      revert();
    }
    _burn(msg.sender, redeemTokens);
    underlying.transfer(msg.sender, responseAmt);
    return responseAmt;
  }

  /**
   * @notice Calculates the exchange rate from the underlying to the CToken
   * @dev This function does not accrue interest before calculating the exchange rate
   * @return Calculated exchange rate scaled by 1e18
   * Exchange rate == token.supply() / fToken.supply()
   */
  function exchangeRateStored() external view returns (uint) {
    return exRate;
  }

  function decimals() public pure override returns (uint8) {
    return 8;
  }

  /*//////////////////////////////////////////////////////////////
                  IFACE METHODS SHARED WITH ERC20 
  //////////////////////////////////////////////////////////////*/
  function allowance(
    address owner,
    address spender
  ) public view override(IFlux, ERC20) returns (uint256) {
    return super.allowance(owner, spender);
  }

  function approve(address spender, uint256 amount) public override(IFlux, ERC20) returns (bool) {
    if (approveAllowed) {
      return super.approve(spender, amount);
    } else {
      return false;
    }
  }

  function balanceOf(address account) public view override(IFlux, ERC20) returns (uint256) {
    return super.balanceOf(account);
  }

  function transfer(address to, uint256 amount) public override(IFlux, ERC20) returns (bool) {
    if (transferAllowed) {
      return super.transfer(to, amount);
    } else {
      return false;
    }
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public override(IFlux, ERC20) returns (bool) {
    if (transferAllowed) {
      return super.transferFrom(from, to, amount);
    } else {
      return false;
    }
  }

  /*//////////////////////////////////////////////////////////////
                      UNUSED IFACE METHODS 
  //////////////////////////////////////////////////////////////*/
  function redeemUnderlying(uint redeemAmount) external returns (uint) {}

  function borrow(uint borrowAmount) external returns (uint) {}

  function repayBorrow(uint repayAmount) external returns (uint) {}

  function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint) {}

  function balanceOfUnderlying(address owner) external returns (uint) {}

  function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint) {}

  function borrowRatePerBlock() external view returns (uint) {}

  function supplyRatePerBlock() external view returns (uint) {}

  function totalBorrowsCurrent() external returns (uint) {}

  function borrowBalanceCurrent(address account) external returns (uint) {}

  function borrowBalanceStored(address account) external view returns (uint) {}

  function exchangeRateCurrent() external returns (uint) {}

  function getCash() external view returns (uint) {}

  function accrueInterest() external returns (uint) {}
}
