// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

interface IStrategy {

  struct StrategyConfig {
    bytes4 strategySelector;
    address baseToken;
    address yieldToken;
    address lockedVault;
    address liquidVault;
    address admin;
  }

  function getStrategyConfig() external view returns (StrategyConfig memory);

  function setStrategyConfig(StrategyConfig memory _newConfig) external; 
  
  function deposit(uint256 amt) payable external returns (uint256);

  function withdraw(uint256 amt) payable external returns (uint256);

  function previewDeposit(uint256 amt) external view returns (uint256);
  
  function previewWithdraw(uint256 amt) external view returns (uint256);

  function paused() external view returns (bool);
}