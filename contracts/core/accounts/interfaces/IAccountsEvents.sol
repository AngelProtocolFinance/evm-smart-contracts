// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsEvents {
  event DaoContractCreated(uint32 endowId, address daoAddress);
  event DonationDeposited(uint256 id, uint256 amount);
  event DonationWithdrawn(uint256 id, address recipient, uint256 amount);
  event RemoveAllowance(address sender, address spender, address tokenAddress);
  event AllowanceStateUpdatedTo(
    address sender,
    address spender,
    address tokenAddress,
    uint256 allowance
  );
  event EndowmentCreated(uint256 id);
  event UpdateEndowment(uint256 id);
  event UpdateConfig();
  event DonationMatchSetup(uint256 id, address donationMatchContract);
  event SwapToken(
    uint256 id,
    AngelCoreStruct.AccountType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOut
  );
  event EndowmentSettingUpdated(uint256 id, string setting);
  // event UpdateEndowmentState(uint256 id, AccountStorage.EndowmentState state);
}
