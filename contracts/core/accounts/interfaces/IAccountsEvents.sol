// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IVault} from "../../vault/interfaces/IVault.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";

interface IAccountsEvents {
  event EndowmentCreated(uint256 endowId, LibAccounts.EndowmentType endowType);
  event EndowmentDeposit(
    uint256 endowId,
    address tokenAddress,
    uint256 amountLocked,
    uint256 amountLiquid
  );
  event EndowmentWithdraw(
    uint256 endowId,
    address tokenAddress,
    uint256 amount,
    IVault.VaultType accountType,
    address beneficiaryAddress,
    uint32 beneficiaryEndowId
  );
  event AllowanceSpent(uint256 endowId, address spender, address tokenAddress, uint256 amount);
  event AllowanceUpdated(
    uint256 endowId,
    address spender,
    address tokenAddress,
    uint256 newBalance,
    uint256 added,
    uint256 deducted
  );
  event TokenSwapped(
    uint256 endowId,
    IVault.VaultType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
  );
}
