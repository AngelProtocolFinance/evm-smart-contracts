// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AngelCoreStruct} from "./../../struct.sol";

interface ISwappingV3 {
    function executeSwaps(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 minAmountOut
    ) external returns (uint256);
}
