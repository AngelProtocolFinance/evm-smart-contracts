// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IVault} from "../../vault/interfaces/IVault.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";

interface IAccountsEvents {
  event AllowanceSpent(uint256 endowId, address spender, address tokenAddress, uint256 amount);
  event AllowanceUpdated(
    uint256 endowId,
    address spender,
    address tokenAddress,
    uint256 newBalance,
    uint256 added,
    uint256 deducted
  );
  event EndowmentCreated(uint256 endowId, LibAccounts.EndowmentType endowType, string);
  event EndowmentUpdated(uint256 endowId);
  event EndowmentClosed(uint256 endowId, LibAccounts.Beneficiary beneficiary, uint32[] relinked);
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
  event ConfigUpdated();
  event DafApprovedEndowmentsUpdated(uint32[] add, uint32[] remove);
  event OwnerUpdated(address owner);
  event DonationMatchCreated(uint256 endowId, address donationMatchContract);
  event TokenSwapped(
    uint256 endowId,
    IVault.VaultType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
  );
  event EndowmentSettingUpdated(uint256 endowId, string setting);
  event EndowmentAllowlistUpdated(
    uint256 endowId,
    LibAccounts.AllowlistType allowlistType,
    address[] add,
    address[] remove
  );
  event EndowmentInvested(
    uint256 endowId,
    bytes4 strategy,
    string network,
    address token,
    uint256 lockAmt,
    uint256 liquidAmt
  );
  event EndowmentRedeemed(
    uint256 endowId,
    bytes4 strategy,
    string network,
    address token,
    uint256 lockAmt,
    uint256 liquidAmt
  );
  event RefundNeeded(IVault.VaultActionData);
  event UnexpectedTokens(IVault.VaultActionData);
}
