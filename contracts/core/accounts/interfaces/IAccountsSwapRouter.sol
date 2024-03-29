// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IVault} from "../../vault/interfaces/IVault.sol";

interface IAccountsSwapRouter {
  function swapToken(
    uint32 id,
    IVault.VaultType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 slippage
  ) external;
}
