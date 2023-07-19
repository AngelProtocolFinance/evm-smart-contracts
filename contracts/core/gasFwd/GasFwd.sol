// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IGasFwd} from "./IGasFwd.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GasFwd is IGasFwd, Initializable {
  error OnlyAccounts();

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

  function payForGas(address token, uint256 amount) external onlyAccounts {
    IERC20(token).safeTransfer(msg.sender, amount);
  }

  function sweep(address token) external onlyAccounts {
    IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
  }
}
