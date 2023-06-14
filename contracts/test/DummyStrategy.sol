// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;
import {IVault} from "../core/vault/interfaces/IVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IStrategy} from "../core/strategy/IStrategy.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

contract DummyStrategy is Pausable, IStrategy {
  StrategyConfig config;
  uint256 dummyAmt; 
  
  constructor(StrategyConfig memory _config) {
    config = _config;
  }

  // Test helpers
  function setDummyAmt(uint256 amt) external {
    dummyAmt = amt;
  }

  function getStrategyConfig() external view returns (StrategyConfig memory){
    return config;
  }

  function setStrategyConfig(StrategyConfig memory _newConfig) external{
    config = _newConfig;
  }
  
  function deposit(uint256 amt) payable external returns (uint256) {
    IERC20(config.baseToken).transferFrom(msg.sender, address(this), amt);
    IERC20(config.yieldToken).approve(msg.sender, dummyAmt);
    return dummyAmt;
  }

  function withdraw(uint256 amt) payable external returns (uint256){
    IERC20(config.yieldToken).transferFrom(msg.sender, address(this), amt);
    IERC20(config.baseToken).approve(msg.sender, dummyAmt);
    return dummyAmt;
  }

  function previewDeposit(uint256 amt) external view returns (uint256) {
    return dummyAmt;
  }
  
  function previewWithdraw(uint256 amt) external view returns (uint256) {
    return dummyAmt;
  }

  function paused() public override(IStrategy, Pausable) view returns (bool) {
    return super.paused();
  }
  function pause() public {
    _pause();
  }
  function unpause() public {
    _unpause();
  }
}