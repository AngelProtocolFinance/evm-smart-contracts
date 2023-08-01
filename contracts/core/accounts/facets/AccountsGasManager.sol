// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {Validator} from "../../validator.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsGasManager} from "../interfaces/IAccountsGasManager.sol";
import {IGasFwd} from "../../gasFwd/IGasFwd.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AccountsGasManager is
  ReentrancyGuardFacet,
  IAccountsGasManager
{
  using SafeERC20 for IERC20;



  /// @notice Ensure the caller is this same contract
  /// @dev Necessary for cross-facet calls that need access control  
  modifier onlyAccountsContract() {
    if(msg.sender != address(this)) {
      revert OnlyAccountsContract();
    }
    _;
  }

  /// @notice Ensure the caller is admin
  modifier onlyAdmin() {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    if(msg.sender != state.config.owner) {
      revert OnlyAdmin();
    }
    _;
  }

  /// @notice Wrapper method for sweeping funds from gasFwd contract on endow closure
  /// @dev Only callable by Accounts Diamond during endow closure flow
  /// The endowment balance is not updated because we dont know which account to assign it to
  /// @return balance returns the balance of the gasFwd contract which was swept to accounts
  function sweepForClosure(uint32 id, address token) external onlyAccountsContract returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return IGasFwd(state.ENDOWMENTS[id].gasFwd).sweep(token);
  }

  /// @notice Wrapper method for sweeping funds from gasFwd contract upon request
  /// @dev If too many funds are allocated to gasFwd, need special permission from AP team
  /// to unlock these funds, sweep them and reallocate them to the specified account.
  /// This permissioned step precludes gaming the gasFwd'er as a way to avoid locked account funds from
  /// incurring early withdraw penalties (i.e. overpay for gas from locked -> refunded to gas fwd -> sweep to liquid)  
  /// @return balance returns the balance of the gasFwd contract which was swept to accounts
  function sweepForEndowment(uint32 id, IVault.VaultType vault, address token) external onlyAdmin returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    uint256 funds = IGasFwd(state.ENDOWMENTS[id].gasFwd).sweep(token);
    if(vault == IVault.VaultType.LOCKED) {
      state.STATES[id].balances.locked[token] += funds;
    } else {
      state.STATES[id].balances.liquid[token] += funds;
    }
    return funds;
  }

  /// @notice Take funds from locked or liquid account and transfer them to the gasFwd
  /// @dev Only callable by the owner, liquidInvestmentManager, or lockedInvestmentManager
  /// Sends the balance specified from the specified token and vault type to the endow's gasFwd contract
  function addGas(uint32 id, IVault.VaultType vault, address token, uint256 amount) external {
    if(!_validateCaller(id)) {
      revert Unauthorized();
    }

    AccountStorage.State storage state = LibAccounts.diamondStorage();
    uint256 balance;
    if(vault == IVault.VaultType.LOCKED) {
      balance = state.STATES[id].balances.locked[token];
      if(balance < amount) {
        revert InsufficientFunds(); 
      }
      state.STATES[id].balances.locked[token] -= amount;
    } else {
      balance = state.STATES[id].balances.liquid[token];
      if(balance < amount) {
        revert InsufficientFunds(); 
      }
      state.STATES[id].balances.liquid[token] -= amount;
    }

    IERC20(token).safeTransfer(state.ENDOWMENTS[id].gasFwd, amount);
  }

  function _validateCaller(uint32 id) internal view returns (bool) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    if(
      Validator.canCall(
        state.ENDOWMENTS[id].settingsController.lockedInvestmentManagement,
        msg.sender,
        block.timestamp
      ) ||       
      Validator.canCall(
        state.ENDOWMENTS[id].settingsController.liquidInvestmentManagement,
        msg.sender,
        block.timestamp
      ) || 
      msg.sender == state.ENDOWMENTS[id].owner
    ) {
      return true;
    }
    return false; 
  }
}
