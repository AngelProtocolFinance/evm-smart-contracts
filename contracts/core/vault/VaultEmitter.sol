// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IVault} from "./interfaces/IVault.sol";
import {IVaultEmitter} from "./interfaces/IVaultEmitter.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @notice the endowment multisig emitter contract
 * @dev the endowment multisig emitter contract is a contract that emits events for all the endowment multisigs across AP
 */
contract VaultEmitter is IVaultEmitter, Initializable, OwnableUpgradeable {
  mapping(address => bool) isVault;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  modifier isEmitter() {
    require(isVault[msg.sender], "Unauthorized");
    _;
  }

  /// @notice emits the Deposit event
  /// @param endowId ID of Endowment for which to deposit
  /// @param vault Address of the Vault
  /// @param amount Amount of tokens deposited
  /// @param sharesReceived Number of shares received
  function deposit(
    uint32 endowId,
    address vault,
    uint256 amount,
    uint256 sharesReceived
  ) public isEmitter {
    emit Deposit(endowId, vault, amount, sharesReceived);
  }

  /// @notice emits the Redeem event
  /// @param endowId ID of Endowment for which to redeem
  /// @param vault Address of the Vault
  /// @param shares Number of shares
  /// @param amountRedeemed Amount of tokens redeemed
  function redeem(
    uint32 endowId,
    address vault,
    uint256 shares,
    uint256 amountRedeemed
  ) public isEmitter {
    emit Redeem(endowId, vault, shares, amountRedeemed);
  }

  /// @notice emits the VaultConfigUpdated event
  /// @param vault Address of the Vault
  /// @param config New Vault config values
  function vaultConfigUpdated(address vault, IVault.VaultConfig memory config) public isEmitter {
    emit VaultConfigUpdated(vault, config);
  }

  /// @notice emits the VaultConfigUpdated event
  /// @param vault Address of the new Vault
  /// @param config New Vault config values
  function vaultCreated(address vault, IVault.VaultConfig memory config) public onlyOwner {
    isVault[vault] = true;
    emit VaultCreated(vault, config);
  }
}
