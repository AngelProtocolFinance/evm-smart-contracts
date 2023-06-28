// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountMessages} from "../message.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";

interface IAccountsDepositWithdrawEndowments {
  struct TokenInfo {
    address addr;
    uint256 amnt;
  }

  function depositMatic(AccountMessages.DepositRequest memory details) external payable;

  //Pending
  function depositERC20(
    AccountMessages.DepositRequest memory details,
    address tokenAddress,
    uint256 amount
  ) external;

  function withdraw(
    uint32 id,
    IVault.VaultType acctType,
    address beneficiaryAddress,
    uint32 beneficiaryEndowId,
    TokenInfo[] memory tokens
  ) external;
}
