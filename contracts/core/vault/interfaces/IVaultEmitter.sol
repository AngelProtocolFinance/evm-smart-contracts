// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IVault} from "./IVault.sol";

interface IVaultEmitter {
  /*////////////////////////////////////////////////
                        EVENTS
  */ ////////////////////////////////////////////////

  /// @notice Event emited on each Deposit call
  /// @dev Upon deposit, emit this event. Index the account and staking contract for analytics
  /// @param endowId ID of Endowment for which to deposit
  /// @param vault Address of the Vault
  /// @param amount Amount of tokens deposited
  /// @param sharesReceived Number of shares received
  event Deposit(uint32 endowId, address vault, uint256 amount, uint256 sharesReceived);

  /// @notice Event emited on each Redemption call
  /// @dev Upon redemption, emit this event. Index the account and staking contract for analytics
  /// @param endowId ID of Endowment for which to redeem
  /// @param vault Address of the Vault
  /// @param shares Number of shares
  /// @param amountRedeemed Amount of tokens redeemed
  event Redeem(uint32 endowId, address vault, uint256 shares, uint256 amountRedeemed);

  /// @notice Event emited on each Harvest call
  /// @param vault Address of the Vault
  /// @param config New Vault config values
  event VaultConfigUpdated(address vault, IVault.VaultConfig config);

  /// @notice Event emited on each Harvest call
  /// @param vault Address of the new Vault
  /// @param config New Vault config values
  event VaultCreated(address vault, IVault.VaultConfig config);

  /// @notice emits the Deposit event
  /// @param endowId ID of Endowment for which to deposit
  /// @param vault Address of the Vault
  /// @param amount Amount of tokens deposited
  /// @param sharesReceived Number of shares received
  function deposit(uint32 endowId, address vault, uint256 amount, uint256 sharesReceived) external;

  /// @notice emits the Redeem event
  /// @param endowId ID of Endowment for which to redeem
  /// @param vault Address of the Vault
  /// @param shares Number of shares
  /// @param amountRedeemed Amount of tokens redeemed
  function redeem(uint32 endowId, address vault, uint256 shares, uint256 amountRedeemed) external;

  /// @notice emits the VaultConfigUpdated event
  /// @param vault Address of the Vault
  /// @param config New Vault config values
  function vaultConfigUpdated(address vault, IVault.VaultConfig memory config) external;

  /// @notice emits the VaultCreated event
  /// @param vault Address of the new Vault
  /// @param config New Vault config values
  function vaultCreated(address vault, IVault.VaultConfig memory config) external;
}
