// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

interface IRouter is IAxelarExecutable {
  /*////////////////////////////////////////////////
                        EVENTS
  */ ////////////////////////////////////////////////

  event Transfer(IVault.VaultActionData action, uint256 amount);
  event Refund(IVault.VaultActionData action, uint256 amount);
  event Deposit(IVault.VaultActionData action);
  event Redeem(IVault.VaultActionData action, uint256 amount);
  event ErrorLogged(IVault.VaultActionData action, string message);
  event ErrorBytesLogged(IVault.VaultActionData action, bytes data);

  /*////////////////////////////////////////////////
                    CUSTOM TYPES
  */ ////////////////////////////////////////////////

  /// @notice Harvest request
  /// @param strategyId The 4 byte truncated keccak256 hash of the strategy name, i.e. bytes4(keccak256("Goldfinch"))
  /// @param accountIds The endowment uids
  struct HarvestRequest {
    bytes4 strategyId;
    uint32[] accountIds;
  }

  /*////////////////////////////////////////////////
                    METHODS
  */ ////////////////////////////////////////////////

  function executeLocal(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
  ) external returns (IVault.VaultActionData memory);

  function executeWithTokenLocal(
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload,
    string calldata tokenSymbol,
    uint256 amount
  ) external returns (IVault.VaultActionData memory);

  function harvest(HarvestRequest memory _action) external;

  function sendTax(address token, uint256 amount, address payee) external;
}
