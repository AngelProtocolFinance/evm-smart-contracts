// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

interface IStrategy {
  struct StrategyConfig {
    bytes4 strategySelector;
    address baseToken;
    address yieldToken;
    address admin;
  }

  event ConfigChanged(StrategyConfig stratConfig);
  event EnteredPosition(uint256 baseTokenAmt, uint256 yieldTokenAmt);
  event WithdrewPosition(uint256 yieldTokenAmt, uint256 baseTokenAmt);
  event LogError(string message);
  event LogErrorBytes(bytes data);

  error TransferFailed();
  error ApproveFailed();
  error DepositFailed();
  error WithdrawFailed();

  /// @notice Returns the config struct
  /// @return Config the current strategy config
  function getStrategyConfig() external view returns (StrategyConfig memory);

  /// @notice Set the strategy config 
  /// @dev This method must be access controlled. The config overwrites the stored config in its entirety 
  /// @param _newConfig The StrategyConfig that willbe stored and referenced within the strategy contract 
  function setStrategyConfig(StrategyConfig memory _newConfig) external;


  /// @notice Accepts deposits of `baseToken` and converts/trades/interacts to achieve `yieldToken`
  /// @dev This method must:
  /// 1) Transfer the `amt` of `stratConfig.baseToken` to this contract
  /// 2) Convert the base token into the `stratConfig.yieldToken via integration-specific methods
  /// 3) Set the msg.sender as approved() for the returned amt
  /// @param amt the qty of `stratConfig.baseToken` that the strategy has been approved to use
  /// @return yieldTokenAmt the qty of `stratConfig.yieldToken` that were yielded from the deposit action
  function deposit(uint256 amt) external payable returns (uint256);


  /// @notice Accepts `yieldTokens` and converts them back into `baseToken`
  /// @dev This method must: 
  /// 1) Transfer the provided `amt` of `stratConfig.yieldToken` to this contract
  /// 2) Convert the yield tokens provided back into the `stratConfig.baseToken via integration-specific methods 
  /// 3) Set the msg.sender as approved() for the returned amt
  /// @param amt the qty of `stratConfig.yieldToken` that this contract has been approved to use by msg.sender
  /// @return baseTokenAmt the qty of `stratConfig.baseToken` that are approved for transfer by msg.sender 
  function withdraw(uint256 amt) external payable returns (uint256);

  /// @notice Provide an estimate for the current exchange rate for a given deposit
  /// @dev This method expects that the `amt` provided is denominated in `baseToken`
  /// @param amt the qty of the `baseToken` that should be checked for conversion rates
  /// @return yieldTokenAmt the expected qty of `yieldToken` if this strategy received `amt` of `baseToken`
  function previewDeposit(uint256 amt) external view returns (uint256);

  /// @notice Provide an estimate for the current exchange rate for a given withdrawal
  /// @dev This method expects that the `amt` provided is denominated in `yieldToken`
  /// @param amt the qty of the `yieldToken` that should be checked for conversion rates
  /// @return yieldTokenAmt the expected qty of `baseToken` if this strategy received `amt` of `yieldToken`
  function previewWithdraw(uint256 amt) external view returns (uint256);

  /// @notice Check whether the contract is paused
  /// @dev Make public the state of the Pausable contract's `paused` state 
  /// @return paused the current state of the paused boolean 
  function paused() external view returns (bool);
}
