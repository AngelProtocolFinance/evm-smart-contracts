// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IGasFwd} from "./IGasFwd.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GasFwd is IGasFwd, Initializable {
  error OnlyAccounts();
  event GasPay(address token, uint256 amount);
  event Sweep(address token, uint256 amount);

  using SafeERC20 for IERC20;

  address accounts;

  function initialize(address _accounts) public initializer {
    accounts = _accounts;
  }

  modifier onlyAccounts() {
    if (msg.sender != accounts) {
      revert OnlyAccounts();
    }
    _;
  }

  function payForGas(address token, uint256 amount) external onlyAccounts returns (uint256) {
    uint256 balance = IERC20(token).balanceOf(address(this));
    if (amount > balance) {
      IERC20(token).safeTransfer(msg.sender, balance);
      emit GasPay(token, balance);
      return balance;
    } else {
      IERC20(token).safeTransfer(msg.sender, amount);
      emit GasPay(token, amount);
      return amount;
    }
  }

  function sweep(address token) external onlyAccounts returns (uint256) {
    uint256 balance = IERC20(token).balanceOf(address(this));
    IERC20(token).safeTransfer(msg.sender, balance);
    emit Sweep(token, balance);
    return balance;
  }
}
