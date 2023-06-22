// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsEvents {
  event DaoContractCreated(uint32 endowId, address daoAddress);
  event DonationDeposited(uint256 id, uint256 amount);
  event DonationWithdrawn(uint256 id, address recipient, uint256 amount);
  event AllowanceRemoved(address sender, address spender, address tokenAddress);
  event AllowanceUpdated(address sender, address spender, address tokenAddress, uint256 allowance);
  event EndowmentCreated(uint256 id);
  event EndowmentUpdated(uint256 id);
  event ConfigUpdated();
  event DonationMatchCreated(uint256 id, address donationMatchContract);
  event TokenSwapped(
    uint256 id,
    AngelCoreStruct.AccountType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
  );
  event EndowmentSettingUpdated(uint256 id, string setting);
  // event EndowmentStateUpdated(uint256 id, AccountStorage.EndowmentState state);
}
