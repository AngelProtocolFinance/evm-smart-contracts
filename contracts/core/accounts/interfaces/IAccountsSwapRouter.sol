// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../../struct.sol";

interface IAccountsSwapRouter {
    function swapToken(
        uint32 id,
        AngelCoreStruct.AccountType accountType,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 slippage
    ) external;
}
