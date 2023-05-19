// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AngelCoreStruct} from "./../../struct.sol";

interface ISwappingV3 {
    function swapTokenToUsdc(
        address tokena,
        uint256 amountin
    ) external returns (uint256);

    function swapEthToToken() external payable returns (uint256);

    function swapEthToAnyToken(
        address token
    ) external payable returns (uint256);

    function executeSwapOperations(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    ) external returns (uint256);
}
