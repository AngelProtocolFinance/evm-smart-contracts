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
  event RewardsHarvested(IVault.VaultActionData action);
  event ErrorLogged(IVault.VaultActionData action, string message);
  event ErrorBytesLogged(IVault.VaultActionData action, bytes data);

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
