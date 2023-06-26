// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsEvents {
  event DaoContractCreated(uint32 endowId, address daoAddress);
  event DonationDeposited(uint256 endowId, address tokenAddress, uint256 amount);
  event DonationWithdrawn(uint256 endowId, address recipient, address tokenAddress, uint256 amount);
  event AllowanceRemoved(address sender, address spender, address tokenAddress);
  event AllowanceUpdated(address sender, address spender, address tokenAddress, uint256 allowance);
  event EndowmentCreated(uint256 endowId);
  event EndowmentUpdated(uint256 endowId);
  event ConfigUpdated();
  event OwnerUpdated(address newOwner);
  event DonationMatchCreated(uint256 endowId, address donationMatchContract);
  event TokenSwapped(
    uint256 endowId,
    AngelCoreStruct.AccountType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
  );
  event EndowmentSettingUpdated(uint256 endowId, string setting);
  // event EndowmentStateUpdated(uint256 endowId);
}
