// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AngelCoreStruct} from "./../../struct.sol";

interface ISwappingV3 {
    function swapTokenToUsdc(
        address curTokena,
        uint256 curAmountin
    ) external returns (uint256);

    function swapEthToToken() external payable returns (uint256);

    function swapEthToAnyToken(
        address token
    ) external payable returns (uint256);

    function executeSwapOperations(
        address curTokenIn,
        address curTokenOut,
        uint256 curAmountIn,
        uint256 curAmountOut
    ) external returns (uint256);
}
