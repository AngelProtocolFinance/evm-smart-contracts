// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

interface IRouter is IAxelarExecutable {
  /*////////////////////////////////////////////////
                        EVENTS
    */ ////////////////////////////////////////////////

  event TokensSent(IVault.VaultActionData action, uint256 amount);
  event FallbackRefund(IVault.VaultActionData action, uint256 amount);
  event Deposit(IVault.VaultActionData action);
  event Redemption(IVault.VaultActionData action, uint256 amount);
  event Harvest(IVault.VaultActionData action);
  event LogError(IVault.VaultActionData action, string message);
  event LogErrorBytes(IVault.VaultActionData action, bytes data);

  /*////////////////////////////////////////////////
                    CUSTOM TYPES
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
}
