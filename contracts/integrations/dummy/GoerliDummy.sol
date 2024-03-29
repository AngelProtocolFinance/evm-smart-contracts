// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {IStrategy} from "../../core/strategy/IStrategy.sol";
import {DummyStrategy} from "../../test/DummyStrategy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDummyERC20 is IERC20 {
  function mint(address account, uint256 amount) external;

  function burn(address account, uint256 amount) external;
}

contract GoerliDummy is DummyStrategy {
  constructor(StrategyConfig memory _config) DummyStrategy(_config) {}

  function deposit(uint256 amt) public payable override returns (uint256) {
    IDummyERC20(config.yieldToken).mint(address(this), amt);
    IERC20(config.baseToken).transferFrom(msg.sender, address(this), amt);
    IDummyERC20(config.yieldToken).approve(msg.sender, amt);
    return amt;
  }

  function withdraw(uint256 amt) public payable override returns (uint256) {
    IERC20(config.yieldToken).transferFrom(msg.sender, address(this), amt);
    IERC20(config.baseToken).approve(msg.sender, amt);
    IDummyERC20(config.yieldToken).burn(address(this), amt);
    return amt;
  }
}
