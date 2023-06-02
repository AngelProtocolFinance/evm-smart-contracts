// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IStrategy} from "./IStrategy.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

abstract contract APStrategy_V1 is IStrategy, Pausable {

  /*//////////////////////////////////////////////////////////////
                                CONFIG
  //////////////////////////////////////////////////////////////*/

  StrategyConfig public config;
  
  constructor(StrategyConfig memory _config) {
    config = _config;
  }

  function getStrategyConfig() external view returns (StrategyConfig memory) {
    return config;
  }

  function setStrategyConfig(StrategyConfig memory _config) external onlyAdmin {
    config = _config;
  }

  /*//////////////////////////////////////////////////////////////
                                ADMIN
  //////////////////////////////////////////////////////////////*/

  modifier onlyAdmin() {
    require(_msgSender() == config.admin);
    _;
  }

  function pause() external virtual onlyAdmin {
    _pause();
  }

  function unpause() external virtual onlyAdmin {
    _unpause();
  }

  /*//////////////////////////////////////////////////////////////
                            IMPLEMENTATION
  //////////////////////////////////////////////////////////////*/

  /// @notice Deposits tokens into the strategy
  /// @dev Transfers erc20 from sender to this contract, makes calls necessary to achieve deposit, 
  /// then sends resulting tokens back to sender. 
  /// @param amt The qty of tokens that the strategy can transfer from the sender. Implies that the 
  /// token address is config.fromToken
  /// Returns the qty of config.toToken resulting from deposit action
  function deposit(uint256 amt) payable external virtual returns (uint256) {

  }

  /// @notice Withdraws tokens from the strategy
  /// @dev Transfers the balance of config.toToken erc20 from sender to this contract, makes calls necessary 
  /// to achieve withdraw with the redemption tokens in hand, then sends resulting tokens back to sender. 
  /// @param amt The qty of tokens that the strategy can transfer from the sender. Implies that the 
  /// token address is config.toToken
  /// Returns the qty of config.fromToken resulting from withdraw action
  function withdraw(uint256 amt) payable external virtual returns (uint256) {

  }

  /// @notice Shows the expected conversion between from and to token
  /// @dev Implies that the amt refers to the config.fromToken
  /// Returns the expected amt of config.toToken 
  function previewDeposit(uint256 amt) external view virtual returns (uint256) {

  }
  
  /// @notice Shows the expected conversion between to and from token
  /// @dev Implies that the amt refers to the config.toToken
  /// Returns the expected amt of config.fromToken 
  function previewWithdraw(uint256 amt) external view virtual returns (uint256) {

  }

  function _beforeDeposit(uint256 amt) internal virtual { 

  }

  function _afterDeposit(uint256 amt) internal virtual {

  }

  function _beforeWithdraw(uint256 amt) internal virtual {

  }

  function _afterWithdraw(uint256 amt) internal virtual {

  }
}